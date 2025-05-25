import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@/generated/prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const {username, password} = req.body;
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const retrievedUser = await prisma.user.create({
        data: {
            username: username,
            password: hash,
        },
    });

    


}