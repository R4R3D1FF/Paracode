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
            const hashedPass = await bcrypt.hash(password, 10);
            const res = await prisma.user.create({
                data: {
                    username,
                    password: hashedPass
                }
            });

            if (!res) {
                return NextResponse.json({ message: "User could not be created" }, { status: 404 });
            }

            if (!process.env.JWT_SECRET) {
                return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
            }

            const newRetrievedUser = await prisma.user.findFirst({
                where: {
                    username
                }
            });

            const user_id = newRetrievedUser?.id;

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

            // return NextResponse.json({ message: "User not found" }, { status: 404 });
        }



        return NextResponse.json({ message: "User already exists" }, { status: 403 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}