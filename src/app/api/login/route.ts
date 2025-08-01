import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@/generated/prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {username, password} = req.body;

    const retrievedUser = await prisma.user.findMany({
        where: {
            username: username,
        },
    });

    const user_id = retrievedUser[0].id;
    const storedPassword = retrievedUser[0].password;
    
    const match = await bcrypt.compare(password, storedPassword);

    if (!process.env.JWT_SECRET)
        return;

    if (match){
        const token = await jwt.sign(
            { user_id, username },        // payload
            process.env.JWT_SECRET, // secret key (string or buffer)
            { expiresIn: '24h' }     // optional options
        );

        const serialized = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        res.setHeader('Set-Cookie', serialized);
        return res.status(200).json({ message: 'Logged in' });
    }

    else{
        return res.status(400).json({ message: 'Forbidden' });
    }


}