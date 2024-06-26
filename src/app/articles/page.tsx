import React, { cache } from "react";
import { Article } from "@prisma/client";
import Articleitem from "@/components/articles/Articleitem";
import SearchArticleInput from "@/components/articles/SearchArticleInput";
import Pagination from "@/components/articles/Pagination";
import { getArticles } from "@/apiCalls/articleApiCall";
import { ARTICLE_PER_PAGE } from "@/utils/constats";
import prisma from "@/utils/dp";

interface ArticlePageProps {
  searchParams: { pageNumber: string };
}

const ArticlesPage = async ({
  searchParams: { pageNumber },
}: ArticlePageProps) => {
  // wait 3s
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  const articles: Article[] = await getArticles(pageNumber);
  // const count: number = await getArticlesCount();
  const count: number = await prisma.article.count();

  const pages = Math.ceil(count / ARTICLE_PER_PAGE);

  return (
    <section className="container m-auto px-5">
      <SearchArticleInput />
      <div className="flex items-center justify-center flex-wrap gap-7">
        {articles.map((item) => (
          <Articleitem article={item} key={item.id} />
        ))}
      </div>
      <Pagination
        pages={pages}
        pageNumber={parseInt(pageNumber)}
        route={"/articles"}
      />
    </section>
  );
};

export default ArticlesPage;
