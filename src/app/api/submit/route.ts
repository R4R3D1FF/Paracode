import { PrismaClient } from '@/generated/prisma/client'; // use standard import
import { NextResponse } from 'next/server';
import { submitFromId } from '@/utils/submit-from-id';
import percentileCalc from '@/utils/percentile';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { problem_id, language, code } = await req.json();

    const body = await submitFromId(language, code, problem_id);

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
