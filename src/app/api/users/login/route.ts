import prisma from "@/utils/dp";
import { LoginUserDto } from "@/utils/dtos";
import { loginSchema } from "@/utils/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setCookie } from "@/utils/generateToken";

/**
 *  @method  POST
 *  @route   ~/api/users/login
 *  @desc    Login User [(Log In) (Sign In) (تسجیل الدخول)]
 *  @access  public
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginUserDto;

    //! VALIDATION
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    //! check EMAIL
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return NextResponse.json(
        { message: "invalid email or password" },
        { status: 400 }
      );
    }

    //! check PASSWORD
    // .compare عشان نفك التشفير
    const isPasswordMatch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "invalid email or password" },
        { status: 400 }
      );
    }

    //! create token & set in cookie
    const cookie = setCookie({
      id: user.id,
      isAdmin: user.isAdmin,
      username: user.username,
    });
    return NextResponse.json(
      { message: "Authenticated" },
      { status: 200, headers: { "Set-Cookie": cookie } }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
