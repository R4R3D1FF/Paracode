import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request
) {
    const problems = await prisma.problem.findMany({
        select: {
            id: true,
            title: true,
            difficulty: true,
        },
    });

    return NextResponse.json(problems);
}