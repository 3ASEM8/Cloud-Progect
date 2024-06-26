import { NextRequest } from "next/server";
import { JWTPayload } from "./types";
import jwt from "jsonwebtoken";

//! نفتح تشفير التوكن

//verify token for Api end point
export function verifyToken(request: NextRequest): JWTPayload | null {
  try {
    const jwtToken = request.cookies.get("jwtToken");
    const token = jwtToken?.value as string;
    if (!token) return null;

    const privateKay = process.env.JWT_SECRET as string;
    const userPayloadFromToken = jwt.verify(token, privateKay) as JWTPayload;
    return userPayloadFromToken;
  } catch (error) {
    return null;
  }
}

//!verify token for Page
export function verifyTokenForPage(token: string): JWTPayload | null {
  try {
    const privateKay = process.env.JWT_SECRET as string;
    const userPayloadFromToken = jwt.verify(token, privateKay) as JWTPayload;

    if (!userPayloadFromToken) return null;
    return userPayloadFromToken;
  } catch (error) {
    return null;
  }
}
