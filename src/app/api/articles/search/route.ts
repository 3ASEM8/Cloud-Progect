import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/dp";

/**
 *  @method  GET
 *  @route   ~/api/articles/search?searchText=value
 *  @desc    Get Articles By Search Text
 *  @access  public
 */
export async function GET(request: NextRequest) {
  try {
    const searchText = request.nextUrl.searchParams.get("searchText");
    let articles;
    if (searchText) {
      articles = await prisma.article.findMany({
        where: {
          title: {
            // equals: searchText,
            // contains: searchText,
            startsWith: searchText,
            mode: "insensitive", //عشان يجيب الحروف الكابتل و الصمول
          },
        },
      });
    } else {
      articles = await prisma.article.findMany({ take: 6 });
    }

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
