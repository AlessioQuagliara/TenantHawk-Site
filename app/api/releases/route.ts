import { NextResponse } from "next/server";
import { getLatestReleases, getRepositorySlug } from "@/app/lib/github";

export const revalidate = 3600;

export async function GET() {
  const releases = await getLatestReleases(12);

  return NextResponse.json(
    {
      repository: getRepositorySlug(),
      releases,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
