// app/api/login/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const retrievedUser = await prisma.user.findMany({
      where: { username },
    });

    if (!retrievedUser || retrievedUser.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });

      // return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user_id = retrievedUser[0].id;
    const storedPassword = retrievedUser[0].password;

    const match = await bcrypt.compare(password, storedPassword);

    if (!process.env.JWT_SECRET) {
      return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
    }

    if (match) {
      const token = jwt.sign(
        { user_id, username },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      const serialized = serialize("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });

      return new NextResponse(
        JSON.stringify({ message: "Logged in" }),
        {
          status: 200,
          headers: { "Set-Cookie": serialized, "Content-Type": "application/json" },
        }
      );
    } else {
      return NextResponse.json({ message: "Forbidden" }, { status: 400 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
