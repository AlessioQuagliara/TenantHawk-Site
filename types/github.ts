export type GithubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  fork: boolean;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
};
