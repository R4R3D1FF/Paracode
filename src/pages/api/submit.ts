import { PrismaClient } from '@/generated/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { coderunFromId } from '@/utilities/coderun';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { parse } from 'cookie';
import percentileCalc from '@/utilities/percentile';

const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse){

    const {problem_id, language, code} = req.body;

    // const testcases = [["1", "1", "1"], ["1", "1", "2"]];

    // const code = "class Solution {\npublic:\n\tbool isPalindrome(string x) {\n\t\treturn 1;\n\t\t\n\t}\n};\n";
    // const driverCode = await prisma.problems.findUnique({
    //     where: {
    //         problem_id: problem_id,
    //     },
    // })
    // .driverCode;
    const driverCodePrefix = "#include <algorithm>\n#include <bitset>\n#include <cassert>\n#include <cmath>\n#include <complex>\n#include <cstdio>\n#include <cstdlib>\n#include <cstring>\n#include <deque>\n#include <exception>\n#include <functional>\n#include <iomanip>\n#include <iostream>\n#include <iterator>\n#include <limits>\n#include <list>\n#include <map>\n#include <numeric>\n#include <queue>\n#include <set>\n#include <sstream>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <unordered_map>\n#include <unordered_set>\n#include <utility>\n#include <vector>\n#include <chrono>\n#include <thread>\n#include <fstream>\n#include <sstream>\nusing namespace std;\n\nstd::vector<std::vector<std::string>> readCSV(const std::string& filename) {\n    std::ifstream file(filename);\n    std::vector<std::vector<std::string>> result;\n    std::string line;\n\n    while (std::getline(file, line)) {\n        std::vector<std::string> row;\n        std::stringstream ss(line);\n        std::string cell;\n\n        while (std::getline(ss, cell, \',\')) {\n            row.push_back(cell);\n        }\n\n        result.push_back(row);\n    }\n\n    return result;\n}";
    let driverCode;
    if (language === "cpp"){
        const problem = await prisma.problem.findUnique({
            where: {
                id: problem_id,
            },
        });
        if (!problem){
            return res.status(500).json({message: "Problem not found"});
        }
        driverCode = problem.driver_code_cpp;
    }
    else{
        return res.status(500).json({message: "Language not yet supported"});
    }

    try{
        const output = await coderunFromId(language,  driverCodePrefix + code + driverCode, problem_id);
        if (output === undefined)
            return res.status(500).json({Error: "Undefined data"});
        const lines = output?.split('\n');
        console.log(output);
        const passed_cases = Number(lines[0]);
        const total_cases = Number(lines[1]);
        const runtime = Number(lines[2]);
        const verdict = lines[3];
        const failed_case = lines[4];
        

        // const rawCookie = req.headers.cookie || '';

        // Parse cookies into an object
        // const cookies = parse(rawCookie);
        // if (!cookies)
        //     return;

        // // Access a specific cookie
        // const token = cookies.token;

        // if (!token)
        //     return;

        // if (!process.env.JWT_SECRET)
        //     return;

        // const jwtPayload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        

        if (passed_cases === total_cases)
            await prisma.submission.create({
                data: {
                    user_id: 1,
                    problem_id,
                    runtime,
                    passed_cases,
                },
            });

        if (verdict === "Correct Answer"){
            const submission_id = await prisma.problem.aggregate({
                _max: {
                    id: true,
                },
            });
            const percentile = percentileCalc(Number(submission_id));
            res.status(200).json({
                passed_cases,
                total_cases,
                runtime,
                verdict,
                percentile
            });
        }
        else
            res.status(200).json({
                passed_cases,
                total_cases,
                runtime,
                verdict,
                failed_case
            });
    }
    catch (error:any){
        return res.status(500).json({Error: error.message});
    }
    
    
}


