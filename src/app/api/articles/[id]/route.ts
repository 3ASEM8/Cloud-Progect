import { UpdateArticleDto } from "@/utils/dtos";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/dp";
import { Article } from "@prisma/client";
import { verifyToken } from "@/utils/verifyToken";
import { comment } from "postcss";

interface Props {
  params: { id: string };
}
// !========GET===========
/**
 * @method GET
 * @route ~/api/articles/:id
 * @desc Get Single Article By Id
 * @access public
 */
export async function GET(request: NextRequest, { params }: Props) {
  try {
    const article = await prisma.article.findUnique({
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
    });

    if (!article) {
      return NextResponse.json({ message: "مش موجود 😘" }, { status: 404 });
    }

    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
// !========PUT===========
/**
 * @method PUT
 * @route ~/api/articles/:id
 * @desc Update Article
 * @access private (only admin can update article)
 */

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 }
      );
    }

    //! بنخزن array الي احنا عاوزين نشتغل عليها
    const article = await prisma.article.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!article) {
      return NextResponse.json({ message: "مش موجود 😘" }, { status: 404 });
    }
    //!اخزن التعديل بتاعي و احوله ل json
    const body = (await request.json()) as UpdateArticleDto;
    //! اضيف التعديل بقا
    const updateArticle = await prisma.article.update({
      where: { id: parseInt(params.id) },
      data: {
        title: body.title,
        description: body.description,
      },
    });

    return NextResponse.json(updateArticle, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
// !=======DELETE=======
/**
 * @method DELETE
 * @route ~/api/articles/:id
 * @desc Delete Article
 * @access public
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "only admin, access denied" },
        { status: 403 }
      );
    }

    //!بنعرفه هنهذف اي
    const article = await prisma.article.findUnique({
      where: { id: parseInt(params.id) },
      include: { comments: true },
    });

    if (!article) {
      return NextResponse.json({ message: "مش موجود 😘" }, { status: 404 });
    }
    //! بنقولو احذف
    await prisma.article.delete({
      where: { id: parseInt(params.id) },
    });
    //! عشان تتحذف مع الكمنتات بتاعته
    const commentIds: number[] = article?.comments.map((comment) => comment.id);
    await prisma.comment.deleteMany({
      where: { id: { in: commentIds } }, // in يقبل array
    });

    return NextResponse.json({ message: "تم الحذف هييه 💋" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
