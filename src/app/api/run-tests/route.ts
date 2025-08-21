import { PrismaClient } from '@/generated/prisma/client'; // use standard import
import { NextResponse } from 'next/server';
import { runTestsFromId } from '@/utils/run-tests-from-id';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { problem_id, language, code, testcases } = await req.json();

    const body = await runTestsFromId(language, code, problem_id, testcases);

    return NextResponse.json(
      body,
      {
        status: 200
      }
    )
    
  } catch (error: any) {
    return NextResponse.json({ Error: error.message }, { status: 500 });
  }
}
