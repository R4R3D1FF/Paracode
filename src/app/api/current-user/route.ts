import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try{
        // console.log(req.cookies);
        const token = req.cookies.get("jwt")?.value; // 👈 available here

        if (!token){
            return NextResponse.json(
                {
                    message: "Not logged in"
                },
                {
                    status: 403
                }
            );
        }

        if (!process.env.JWT_SECRET){
            return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
        }


        const body = jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.json(
            body,
            {
                status: 500
            }
        );

    }

    catch(e: any){
        return NextResponse.json(
            {
                error: e.message
            },
            {
                status: 500
            }
        );
    }
    

}