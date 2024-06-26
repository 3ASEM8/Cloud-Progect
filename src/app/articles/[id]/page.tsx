import AddCommentForm from "@/components/comments/AddCommentForm";
import CommentItem from "@/components/comments/CommentItem";
import { SingleArticle } from "@/utils/types";
import React from "react";
import { cookies } from "next/headers";
import { verifyTokenForPage } from "@/utils/verifyToken";
import prisma from "@/utils/dp";
import { notFound } from "next/navigation";
// import { getSigleArticle } from "@/apiCalls/articleApiCall";
// import { resolve } from "path";

interface SingleArticlePageProps {
  params: { id: string };
}

const page = async ({ params }: SingleArticlePageProps) => {
  const token = cookies().get("jwtToken")?.value || "";
  const userPayloadFromToken = verifyTokenForPage(token);
  //  عشان اشوف لودينج الاسكلاتون
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  // const result: SingleArticle = await getSigleArticle(params.id);

  const result = (await prisma.article.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      comments: {
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })) as SingleArticle;

  if (!result) {
    notFound();
  }

  return (
    <section className="fix-height container m-auto w-full px-5 pt-8 md:w-3/4">
      <div className="bg-white p-7 rounded-lg mb-7">
        <h1 className="text-3xl font-bold text-gray-700 mb-2">
          {result.title}
        </h1>
        <div className="text-gray-400">
          {new Date(result.createdAt).toDateString()}
        </div>
        <p className="text-gray-800 text-xl mt-5">{result.description}</p>
      </div>
      <div className="mt-7">
        {token ? (
          <AddCommentForm articleId={result.id} />
        ) : (
          <p className="text-blue-600 md:text-xl">
            to write a comment you should login first
          </p>
        )}
      </div>
      <h4 className="text-xl text-gray-800 ps-1 font-semibold mb-2 mt-7">
        Comments
      </h4>
      {result.comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          userId={userPayloadFromToken?.id}
        />
      ))}
    </section>
  );
};

export default page;
