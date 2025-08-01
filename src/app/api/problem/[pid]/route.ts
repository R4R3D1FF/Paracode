import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: { pid: string } }
) {
    const problem = await prisma.problem.findUnique({
        where: {
            id: Number(await params.pid),
        },
        select: {
            title: true,
            content: true,
        }

    });
    return NextResponse.json({ title: problem?.title, content: problem?.content });
}