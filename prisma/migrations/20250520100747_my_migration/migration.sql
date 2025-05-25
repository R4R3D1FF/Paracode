-- CreateTable
CREATE TABLE "Problem" (
    "id" SERIAL NOT NULL,
    "driver_code_c" TEXT,
    "driver_code_cpp" TEXT,
    "driver_code_python" TEXT,
    "driver_code_java" TEXT,
    "testcases" TEXT NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "problem_id" INTEGER NOT NULL,
    "runtime" INTEGER NOT NULL,
    "passed_cases" INTEGER NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
