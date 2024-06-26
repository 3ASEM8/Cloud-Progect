import { NextRequest, NextResponse } from "next/server";

import { createArticleSchema } from "@/utils/validationSchemas";
import { CreateArticleDto } from "@/utils/dtos";
import prisma from "@/utils/dp";
import { Article } from "@prisma/client";
import { ARTICLE_PER_PAGE } from "@/utils/constats";
import { verifyToken } from "@/utils/verifyToken";

// !=======GET============
/**
 * @method GET
 * @route ~/api/articles
 * @desc Get All Articles By Page Number
 * @access public
 */

export async function GET(request: NextRequest) {
  try {
    // searchParams to get pageNumber from quary string
    const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1";

    const articles = await prisma.article.findMany({
      skip: ARTICLE_PER_PAGE * (parseInt(pageNumber) - 1),
      take: ARTICLE_PER_PAGE,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
// !=======POST============
/**
 * @method POST
 * @route ~/api/articles
 * @desc created New Article
 * @access private (only admin can create article)
 */

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as CreateArticleDto;

    const valedation = createArticleSchema.safeParse(body);
    if (!valedation.success) {
      return NextResponse.json(
        { message: valedation.error.errors[0].message },
        { status: 400 }
      );
    }
    const newArticle: Article = await prisma.article.create({
      data: {
        title: body.title,
        description: body.description,
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
