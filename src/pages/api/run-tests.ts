import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { coderunTests } from '@/utilities/coderun';

const prisma = new PrismaClient();


export default async function handler(req: NextApiRequest, res: NextApiResponse){

    const {problem_id, language, code, testcases} = req.body;

    // const testcases = [["1", "1", "1"], ["1", "1", "2"]];

    // const code = "class Solution {\npublic:\n\tbool isPalindrome(string x) {\n\t\treturn 1;\n\t\t\n\t}\n};\n";
    
    let driverCode;
    if (language === "cpp")
        driverCode = await prisma.problems.findUnique({
            where: {
                problem_id: problem_id,
            },
        })
        .driver_code_cpp;
    const driverCodePrefix = "#include <algorithm>\n#include <bitset>\n#include <cassert>\n#include <cmath>\n#include <complex>\n#include <cstdio>\n#include <cstdlib>\n#include <cstring>\n#include <deque>\n#include <exception>\n#include <functional>\n#include <iomanip>\n#include <iostream>\n#include <iterator>\n#include <limits>\n#include <list>\n#include <map>\n#include <numeric>\n#include <queue>\n#include <set>\n#include <sstream>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <unordered_map>\n#include <unordered_set>\n#include <utility>\n#include <vector>\n#include <chrono>\n#include <thread>\n#include <fstream>\n#include <sstream>\nusing namespace std;\n\nstd::vector<std::vector<std::string>> readCSV(const std::string& filename) {\n    std::ifstream file(filename);\n    std::vector<std::vector<std::string>> result;\n    std::string line;\n\n    while (std::getline(file, line)) {\n        std::vector<std::string> row;\n        std::stringstream ss(line);\n        std::string cell;\n\n        while (std::getline(ss, cell, \',\')) {\n            row.push_back(cell);\n        }\n\n        result.push_back(row);\n    }\n\n    return result;\n}";
    // const driverCode = "int main(){\n    \n    Solution sol = Solution();\n\n    int endIndex = -1;\n    bool TLE = 0;\n\n    vector<vector<string>> testcases = readCSV(\"/home/codes/temp.csv\");\n    \n    int trueCases = 0;\n    auto start = std::chrono::high_resolution_clock::now();\n    for (int i = 0; i < testcases.size(); i++){\n        string output = (sol.isPalindrome(testcases[i][0]) ? \"1\" : \"0\");\n        auto end = std::chrono::high_resolution_clock::now();\n        std::chrono::duration<double, std::milli> elapsed = end - start;\n        if (output == testcases[i][1] && elapsed.count() < 700)\n            trueCases++;\n        else{\n            if (elapsed.count() >= 700)\n                TLE = 1;\n            endIndex = i;\n            break;\n        }\n\n    }\n\n    auto end = std::chrono::high_resolution_clock::now();\n\t\n\tcout << trueCases << endl;\n    cout << testcases.size() << endl;\n    \n    std::chrono::duration<double, std::milli> elapsed = end - start;\n    cout << elapsed.count() << endl;\n    if (TLE){\n        cout << \"TLE\\n\";\n    }\n    else if (trueCases != testcases.size()){\n        cout << \"Wrong Answer\\n\";\n        for (int i = 0; i < testcases[endIndex].size(); i++){\n            cout << testcases[endIndex][i] << \',\';\n        }\n        cout << endl;\n    }\n    else{\n        cout << \"Correct Answer\\n\";\n        cout << endl;\n    }\n    return 0;\n}";

    try{
        const output = await coderunTests(language,  driverCodePrefix + code + driverCode, testcases);
        if (output === undefined)
            return res.status(500).json({Error: "Undefined data"});
        const lines = output?.split('\n');
        console.log(output);
        res.status(200).json({
            true_cases: lines[0],
            total_cases: lines[1],
            runtime: lines[2],
            verdict: lines[3],
            failed_case: lines[4]
        });
    }
    catch (error:any){
        return res.status(500).json({Error: error.message});
    }
    
    
}


