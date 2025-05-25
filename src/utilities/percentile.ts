import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export default async function percentileCalc(submissionId: number){
    const submission = await prisma.submission.findUnique({
        where: {
            id: submissionId,
        }
    });

    if (submission){
        const runtime = submission.runtime;
        const lowerSubmissions = await prisma.submission.count({
            where: {
                runtime: {
                    lt: runtime,
                },
            },
        });
        const totalSubmissions = await prisma.submission.count();

        if (totalSubmissions != 0){
            return lowerSubmissions/totalSubmissions*100;
        }
        else{
            throw new Error("Database does not yet contain any submissions.");
        }

    }
    else{
        throw new Error("Submission ID not found in database.");
    }
}