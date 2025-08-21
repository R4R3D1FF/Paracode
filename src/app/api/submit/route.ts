import { PrismaClient } from '@/generated/prisma/client'; // use standard import
import { NextResponse } from 'next/server';
import { submitFromId } from '@/utils/submit-from-id';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { problem_id, language, code } = await req.json();

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
      .map(c => `${c.name}=${c.value}`)
    .join("; ");

    const resp = await (await fetch(`${process.env.API_BASE_URL}/current-user`,
        {
            headers: {
                Cookie: cookieHeader, // forward client cookies
            },
            // cache: "no-store", // avoid caching user-specific data
        }
    )).json();
    
    const user_id = resp.user_id;

    const body = await submitFromId(language, code, problem_id, user_id);

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
