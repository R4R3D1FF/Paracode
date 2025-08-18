import { coderun } from "./coderun";
import percentileCalc from "./percentile";
import prisma from "./prisma-instance";

function splitOnLastSpace(str: string) {
    const index = str.lastIndexOf(" ");
    if (index === -1) return [str]; // no comma
    return [str.slice(0, index), str.slice(index + 1)];
}

export async function submitFromId(language: string, code: string, problem_id: number):
    Promise<{
        passed_cases: number,
        total_cases: number,
        runtime: number,
        failedCase?: string,
        percentile?: number,
    }> {



    // console.log(code);



    const problem = await prisma.problem.findUnique({
        where: {
            id: problem_id,
        },
    });

    const testcases = problem?.testcases.split('\n');



    console.log(testcases);

    try {
        if (testcases) {
            switch (language) {

                case "cpp":

                    let passed_cases = 0;
                    let runtime = 0;
                    let failedCase: string = "";

                    const driverCodePrefix =
                        `
#include <algorithm>
#include <bitset>
#include <cassert>
#include <cmath>
#include <complex>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <deque>
#include <exception>
#include <functional>
#include <iomanip>
#include <iostream>
#include <iterator>
#include <limits>
#include <list>
#include <map>
#include <numeric>
#include <queue>
#include <set>
#include <sstream>
#include <stack>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>
#include <thread>
#include <fstream>
#include <sstream>
using namespace std;
`;

                    const driverCode = (
                        await prisma.problem.findUnique({
                            where: {
                                id: problem_id,
                            },
                            select: {
                                driver_code_cpp: true,
                            },
                        })
                    )
                        ?.driver_code_cpp;

                    const totalCode = driverCodePrefix + code + driverCode;

                    console.log("Total code:\n", totalCode);

                    for (let i = 0; i < testcases.length; i++) {
                        const [testcase, target]: string[] = splitOnLastSpace(testcases[i]);
                        const { output, duration } = await coderun(language, totalCode, 30000, testcase);

                        if (output === target) {
                            passed_cases++;
                        }
                        else {
                            if (failedCase != "")
                                failedCase = testcase;
                        }
                        runtime += duration;
                    }

                    const id = (await prisma.submission.create({
                        data: {
                            user_id: 1, // replace with actual user logic
                            problem_id,
                            runtime: runtime,
                            passed_cases: passed_cases,
                        },
                    })).id;

                    const percentile = await percentileCalc(id);

                    if (passed_cases != testcases.length)
                        return {
                            passed_cases,
                            total_cases: testcases.length,
                            runtime,
                            failedCase
                        };
                    else
                        return {
                            passed_cases,
                            total_cases: testcases.length,
                            runtime,
                            percentile
                        };

                default:
                    return {
                        passed_cases: 0,
                        total_cases: 0,
                        runtime: 0
                    }
                    break;
            }
            // return await coderunTests(language, code, testcases);
        }
        else
            throw new Error("Testcases undefined.\n");
    }

    catch (error: any) {
        throw error;
    }




}