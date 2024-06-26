import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/utils/dp";
import { RegisterUserDto } from "@/utils/dtos";
import { registerSchema } from "@/utils/validationSchemas";
import { JWTPayload } from "@/utils/types";
import { setCookie } from "@/utils/generateToken";

/**
 * @method   POST
 * @route    ~/api/users/register
 * @desc     Create New User [(Register) (Sign Up) (انشاء حساب)]
 * @access   public
 */

export async function POST(request: NextRequest) {
  try {
    //!ناخد البيانات نحولها json
    const body = (await request.json()) as RegisterUserDto;

    //!valedation
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (user) {
      return NextResponse.json(
        { message: "this user already registered" },
        { status: 400 }
      );
    }
    //! create new user in database
    //! عشان نشفر الباسوورد
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
      },
      select: {
        username: true,
        id: true,
        isAdmin: true,
      },
    });

    //! create token & set in cookie
    const cookie = setCookie({
      id: newUser.id,
      isAdmin: newUser.isAdmin,
      username: newUser.username,
    });

    return NextResponse.json(
      { ...newUser },
      { status: 201, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal servar error" },
      { status: 500 }
    );
  }
}
