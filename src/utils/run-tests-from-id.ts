import { TestcaseVerdict } from "@/types/types";
import { coderun } from "./coderun";
import percentileCalc from "./percentile";
import prisma from "./prisma-instance";

function splitOnLastSpace(str: string) {
    const index = str.lastIndexOf(" ");
    if (index === -1) return [str]; // no comma
    return [str.slice(0, index), str.slice(index + 1)];
}

export async function runTestsFromId(language: string, code: string, problem_id: number, testcases: string):
    Promise<Array<
        TestcaseVerdict
    >> {



    // console.log(code);







    // console.log(parsedTestcases);

    try {
        if (testcases) {


            switch (language) {

                case "cpp":

                    const problem = await prisma.problem.findUnique({
                        where: {
                            id: problem_id,
                        },
                    });

                    const parsedTestcases = testcases.split('\n');


                    let testcaseVerdicts: Array<TestcaseVerdict> = [];
                    // let passed_cases = 0;
                    // let runtime = 0;
                    // let failed_case: string = "";

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

                    const solutionCode = (
                        await prisma.problem.findUnique({
                            where: {
                                id: problem_id,
                            },
                            select: {
                                solution_code_cpp: true,
                            },
                        })
                    )
                        ?.solution_code_cpp;

                    const totalCode = driverCodePrefix + code + driverCode;
                    const totalSolutionCode = driverCodePrefix + solutionCode + driverCode;

                    console.log("Total code:\n", totalCode);

                    

                    for (let i = 0; i < parsedTestcases.length; i++) {
                        const target = (await coderun(language, totalSolutionCode, 30000, parsedTestcases[i])).output;

                        try {
                            const { output, duration } = await coderun(language, totalCode, 30000, parsedTestcases[i]);

                            const thisVerdict: TestcaseVerdict = {
                                testcase: parsedTestcases[i],
                                passed: (output === target),
                                output,
                                target,
                                timeout: false,
                                runtime: duration
                            };

                            testcaseVerdicts.push(thisVerdict);
                        }
                        catch (error: any) {
                            if (error.message === "Process timed out") {
                                const thisVerdict: TestcaseVerdict = {
                                    testcase: parsedTestcases[i],
                                    passed: false,
                                    timeout: true,
                                }

                                testcaseVerdicts.push(thisVerdict);
                            }
                            else throw (error);
                        }

                    }

                    return testcaseVerdicts;


                default:
                    return new Array<TestcaseVerdict>();
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