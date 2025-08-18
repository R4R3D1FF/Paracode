import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { coderun } from '@/utils/coderun'; // adjust to your actual path

export async function POST(req: NextRequest) {
  const requestId = uuidv4();

  const { language, code } = await req.json();

  console.log(code);

  try {
    const output = await coderun(language, code, 3000);
    return new Response(JSON.stringify({ message: output }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
