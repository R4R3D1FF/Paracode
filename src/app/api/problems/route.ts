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

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const problem = await prisma.problem.create({ data });
    return NextResponse.json(problem, { status: 201 });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}