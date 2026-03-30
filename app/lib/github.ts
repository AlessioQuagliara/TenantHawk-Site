import { GithubRepo } from "@/types/github";

const DEFAULT_REPO_NAME = "TenantHawk";
const DEFAULT_USERNAME = "AlessioQuagliara";
const GITHUB_API = "https://api.github.com";

type GithubConfig = {
  username: string | null;
  token: string | null;
  featuredRepoNames: Set<string>;
};

export type GitHubRelease = {
  id: number;
  tagName: string;
  name: string;
  htmlUrl: string;
  publishedAt: string;
  body: string;
  prerelease: boolean;
};

type GitHubApiRelease = {
  id: number;
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  body: string;
  prerelease: boolean;
};

function getConfig(): GithubConfig {
  const username = process.env.GITHUB_USERNAME?.trim() || DEFAULT_USERNAME;
  const token = process.env.GITHUB_TOKEN?.trim() || null;
  const featuredRepoNames = new Set(
    (process.env.GITHUB_FEATURED_REPOS || DEFAULT_REPO_NAME)
      .split(",")
      .map((repo) => repo.trim().toLowerCase())
      .filter(Boolean)
  );

  return { username, token, featuredRepoNames };
}

function getHeaders(token: string | null, accept = "application/vnd.github+json"): HeadersInit {
  return {
    Accept: accept,
    "User-Agent": "TenantHawk-Marketing-Site",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getFetchOptions() {
  if (process.env.NODE_ENV === "development") {
    return { cache: "no-store" as const };
  }

  return { next: { revalidate: 300 } };
}

function getPrimaryRepoName(): string {
  return process.env.GITHUB_REPO_NAME?.trim() || DEFAULT_REPO_NAME;
}

export function getRepositorySlug(): string {
  const { username } = getConfig();
  return `${username || DEFAULT_USERNAME}/${getPrimaryRepoName()}`;
}

function sanitizeText(input: string): string {
  return input.replace(/\r/g, "").trim();
}

function markdownToPlain(markdown: string): string {
  return sanitizeText(
    markdown
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/^[-*+]\s+/gm, "")
      .replace(/^\d+\.\s+/gm, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/_{1,2}([^_]+)_{1,2}/g, "$1")
      .replace(/>\s?/g, "")
      .replace(/\n{3,}/g, "\n\n")
  );
}

function normalizeRelease(entry: GitHubApiRelease): GitHubRelease {
  return {
    id: entry.id,
    tagName: entry.tag_name,
    name: entry.name || entry.tag_name,
    htmlUrl: entry.html_url,
    publishedAt: entry.published_at,
    body: markdownToPlain(entry.body || ""),
    prerelease: entry.prerelease,
  };
}

export async function getLatestReleases(limit = 4): Promise<GitHubRelease[]> {
  const { token } = getConfig();
  const repo = getRepositorySlug();

  try {
    const response = await fetch(`${GITHUB_API}/repos/${repo}/releases`, {
      headers: getHeaders(token),
      ...getFetchOptions(),
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as GitHubApiRelease[];

    return data
      .filter((release) => !release.prerelease)
      .slice(0, limit)
      .map(normalizeRelease);
  } catch {
    return [];
  }
}

function repoHasFeaturedTopic(repo: GithubRepo): boolean {
  return (repo.topics || []).some((topic) => topic.toLowerCase() === "featured");
}

async function hydrateRepoTopics(repos: GithubRepo[], username: string, token: string | null): Promise<GithubRepo[]> {
  const reposNeedingTopics = repos.filter((repo) => (repo.topics || []).length === 0);

  if (reposNeedingTopics.length === 0) {
    return repos;
  }

  const hydrated = await Promise.all(
    repos.map(async (repo) => {
      if ((repo.topics || []).length > 0) {
        return repo;
      }

      try {
        const response = await fetch(`${GITHUB_API}/repos/${username}/${repo.name}/topics`, {
          headers: getHeaders(token),
          ...getFetchOptions(),
        });

        if (!response.ok) {
          return repo;
        }

        const payload: { names?: string[] } = await response.json();
        if (!Array.isArray(payload.names)) {
          return repo;
        }

        return { ...repo, topics: payload.names };
      } catch {
        return repo;
      }
    })
  );

  return hydrated;
}

export async function getFeaturedRepos(): Promise<GithubRepo[]> {
  const { username, token, featuredRepoNames } = getConfig();

  if (!username) {
    return [];
  }

  try {
    const response = await fetch(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`, {
      headers: getHeaders(token),
      ...getFetchOptions(),
    });

    if (!response.ok) {
      return [];
    }

    const repos: GithubRepo[] = await response.json();
    const nonForkRepos = repos.filter((repo) => !repo.fork);
    const reposWithTopics = await hydrateRepoTopics(nonForkRepos, username, token);

    const featuredByTopic = reposWithTopics.filter(repoHasFeaturedTopic);
    const featuredByEnv = reposWithTopics.filter((repo) => featuredRepoNames.has(repo.name.toLowerCase()));
    const merged = [...featuredByTopic, ...featuredByEnv].filter(
      (repo, index, array) => array.findIndex((candidate) => candidate.id === repo.id) === index
    );

    const onlyTenantHawk = merged.filter((repo) => repo.name.toLowerCase() === getPrimaryRepoName().toLowerCase());

    if (onlyTenantHawk.length > 0) {
      return onlyTenantHawk.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }

    return reposWithTopics
      .filter((repo) => repo.name.toLowerCase() === getPrimaryRepoName().toLowerCase())
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 1);
  } catch {
    return [];
  }
}

export async function getRepoByName(name: string): Promise<GithubRepo | null> {
  const { username, token } = getConfig();

  if (!username) {
    return null;
  }

  try {
    const response = await fetch(`${GITHUB_API}/repos/${username}/${name}`, {
      headers: getHeaders(token),
      ...getFetchOptions(),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export async function getRepoReadme(name: string): Promise<string | null> {
  const { username, token } = getConfig();

  if (!username) {
    return null;
  }

  try {
    const response = await fetch(`${GITHUB_API}/repos/${username}/${name}/readme`, {
      headers: getHeaders(token, "application/vnd.github.raw+json"),
      ...getFetchOptions(),
    });

    if (!response.ok) {
      return null;
    }

    return response.text();
  } catch {
    return null;
  }
}

export function formatDate(date: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
