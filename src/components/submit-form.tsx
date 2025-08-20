'use client';

import { Editor } from "@monaco-editor/react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { TestcaseVerdict } from "@/types/types";

export default function SubmitForm({ problem_id, className }: { problem_id: number, className: string }) {
    const [code, setCode] = useState('');
    const [verdict, setVerdict] = useState('');
    const [passed, setPassed] = useState('');
    const [total, setTotal] = useState('');
    const [error, setError] = useState('');
    const [testcases, setTestcases] = useState('');
    const [testcasesResult, setTestcasesResult] = useState(new Array<TestcaseVerdict>());

    const defaultCodes = {
        cpp:
            `class Solution{
    public:
    bool isPalindrome(){
        return 0;
    }
};`
    }

    useEffect(() => {
        setCode(defaultCodes["cpp"]);
    }, [])

    const handleRun = async () => {
        if (testcases === "") {
            return;
        }
        const res = await fetch('/api/run-tests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                problem_id,
                language: "cpp",
                code,
                testcases
            }),
        });

        const data = await res.json();
        // console.log(data);
        setTestcasesResult(data);
    };

    const handleSubmit = async () => {
        const res = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                problem_id,
                language: "cpp",
                code
            }),
        });

        const data = await res.json();
        console.log(data);
        if (!data.passed_cases || !data.total_cases)
            setVerdict("");
        else if (data.passed_cases === data.total_cases)
            setVerdict("Correct Answer");
        else
            setVerdict("Wrong Answer");
        setError(data.Error);
        setPassed(data.passed_cases || "");
        setTotal(data.total_cases || "");
    };

    return (
        <div className={clsx(`flex flex-col justify-center`, className)}>
            <div className="flex flex-col gap-4 pb-10">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Code Runner</h1>
                <div className="h-64">

                    <Editor
                        defaultLanguage="cpp"
                        value={code}
                        onChange={(value) => setCode(value || "")}
                        height="100%"
                        defaultValue={defaultCodes["cpp"]}
                        className="w-full py-4 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        theme="vs-light dark:vs-dark"
                    />
                </div>

                <textarea
                    value={testcases}
                    onChange={(e) => setTestcases(e.target.value || "")}
                    className="w-full py-4 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex gap-4">

                    <button
                        onClick={handleRun}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Run Tests
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Submit
                    </button>

                </div>
            </div>

            <h1 className="text-3xl font-bold mb-6 text-gray-800">Output</h1>
            <div className="min-h-32 mt-2 p-4 bg-gray-100 border border-gray-300 rounded-lg text-sm font-mono w-full overflow-auto">
                {
                    verdict ?
                        <>

                            <p className={` text-xl ${verdict === "Wrong Answer" ? "text-red-500" : "text-green-500"}`}>
                                {verdict}
                            </p>


                            <p>
                                {`Passed ${passed} out of ${total} testcases.`}
                            </p>
                        </>
                        :
                        <></>
                }

                {
                    error ?
                        <div className="w-full overflow-auto">
                            <p className="text-xl text-red-500">
                                Runtime Error
                            </p>

                            <p>
                                {error}
                            </p>
                        </div>
                        :
                        <></>
                }

            </div>

            <h1 className="text-3xl font-bold my-6 text-gray-800">Test Results</h1>
            <div className="min-h-32 mt-2 p-4 bg-gray-100 border border-gray-300 rounded-lg text-sm font-mono w-full overflow-auto">
                {
                    testcasesResult?.map((item: TestcaseVerdict) => (
                        <div className="border-b py-2">
                            {
                                item.passed ?
                                    <p className="text-green-500"> Passed </p>
                                    :
                                    <p className="text-red-500"> Failed </p>
                            }
                            {
                                item.output ?
                                    <div>
                                        <p> Output: {item.output} </p>
                                        <p> Expected: {item.target} </p>
                                    </div>
                                    :
                                    <></>
                            }
                            <p> {item.runtime} </p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}