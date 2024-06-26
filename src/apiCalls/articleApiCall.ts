import { DOMAIN } from "@/utils/constats";
import { SingleArticle } from "@/utils/types";
import { Article } from "@prisma/client";

//!get Articles based on page number
export async function getArticles(
  pageNumber: string | undefined
): Promise<Article[]> {
  //promise because asynk
  const response = await fetch(
    `${DOMAIN}/api/articles?pageNumber=${pageNumber}`,
    { cache: "no-store" }
    // {next: {revalidate: 50}}
  );
  if (!response.ok) {
    throw new Error("faild to fetch articles");
  }
  return response.json();
}

//!get Articles count
export async function getArticlesCount(): Promise<number> {
  //promise because asynk
  const response = await fetch(`${DOMAIN}/api/articles/count`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("faild to get articles articles count");
  }
  const { count } = (await response.json()) as { count: number };
  return count;
}

//!get Articles based on search Text
export async function getSearchArticles(
  searchText: string
): Promise<Article[]> {
  //promise because asynk
  const response = await fetch(
    `${DOMAIN}/api/articles/search?searchText=${searchText}`
  );
  if (!response.ok) {
    throw new Error("faild to fetch articles");
  }

  return response.json();
}

export async function getSigleArticle(
  articleId: string
): Promise<SingleArticle> {
  const response = await fetch(`${DOMAIN}/api/articles/${articleId}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("faild to fetch param ID");
  }
  return await response.json();
}
