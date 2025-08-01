import { PrismaClient } from '@/generated/prisma/client'; // use standard import
import { NextResponse } from 'next/server';
import { coderunFromId } from '@/utilities/coderun';
import percentileCalc from '@/utilities/percentile';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { problem_id, language, code } = await req.json();

    const driverCodePrefix = "#include <algorithm>\n#include <bitset>\n#include <cassert>\n#include <cmath>\n#include <complex>\n#include <cstdio>\n#include <cstdlib>\n#include <cstring>\n#include <deque>\n#include <exception>\n#include <functional>\n#include <iomanip>\n#include <iostream>\n#include <iterator>\n#include <limits>\n#include <list>\n#include <map>\n#include <numeric>\n#include <queue>\n#include <set>\n#include <sstream>\n#include <stack>\n#include <stdexcept>\n#include <string>\n#include <unordered_map>\n#include <unordered_set>\n#include <utility>\n#include <vector>\n#include <chrono>\n#include <thread>\n#include <fstream>\n#include <sstream>\nusing namespace std;\n\nstd::vector<std::vector<std::string>> readCSV(const std::string& filename) {\n    std::ifstream file(filename);\n    std::vector<std::vector<std::string>> result;\n    std::string line;\n\n    while (std::getline(file, line)) {\n        std::vector<std::string> row;\n        std::stringstream ss(line);\n        std::string cell;\n\n        while (std::getline(ss, cell, \',\')) {\n            row.push_back(cell);\n        }\n\n        result.push_back(row);\n    }\n\n    return result;\n}"; // keep your full prefix

    let driverCode: string;
    if (language === 'cpp') {
      const problem = await prisma.problem.findUnique({
        where: { id: problem_id },
      });
      if (!problem) {
        return NextResponse.json({ message: 'Problem not found' }, { status: 500 });
      }
      driverCode = problem.driver_code_cpp || '';
    } else {
      return NextResponse.json({ message: 'Language not supported' }, { status: 500 });
    }

    const output = await coderunFromId(language, driverCodePrefix + code + driverCode, problem_id);
    if (!output) {
      return NextResponse.json({ Error: 'Undefined data' }, { status: 500 });
    }

    const lines = output.split('\n');
    const passed_cases = Number(lines[0]);
    const total_cases = Number(lines[1]);
    const runtime = Number(lines[2]);
    const verdict = lines[3];
    const failed_case = lines[4];

    if (passed_cases === total_cases) {
      await prisma.submission.create({
        data: {
          user_id: 1, // replace with actual user logic
          problem_id,
          runtime,
          passed_cases,
        },
      });
    }

    if (verdict === 'Correct Answer') {
      const submission_id = await prisma.problem.aggregate({
        _max: { id: true },
      });

      const percentile = percentileCalc(Number(submission_id._max.id));
      return NextResponse.json({
        passed_cases,
        total_cases,
        runtime,
        verdict,
        percentile,
      });
    } else {
      return NextResponse.json({
        passed_cases,
        total_cases,
        runtime,
        verdict,
        failed_case,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ Error: error.message }, { status: 500 });
  }
}
