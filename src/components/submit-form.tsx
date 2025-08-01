'use client';

import { Editor } from "@monaco-editor/react";
import { useState, useEffect } from "react";
import clsx from "clsx";

export default function SubmitForm({ problem_id, className }: { problem_id: number, className: string }) {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [passed, setPassed] = useState('');
    const [total, setTotal] = useState('');
    const [error, setError] = useState('');
    const [testcases, setTestcases] = useState('');

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
        console.log(data);
        setOutput(data.verdict);
        setError(data.Error);
        setPassed(data.passed_cases || "");
        setTotal(data.total_cases || "");
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
        setOutput(data.verdict);
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
                    output ?
                        <>

                            <p className={` text-xl ${output === "Wrong Answer" ? "text-red-500" : "text-green-500"}`}>
                                {output}
                            </p>


                            <p>
                                {`Passed ${passed} out of ${total} testcases.`}
                            </p>
                        </>
                        :
                        <div className="w-full overflow-auto">
                            <p className="text-xl text-red-500">
                                Runtime Error
                            </p>

                            <p>
                                {error}
                            </p>
                        </div>
                }
            </div>
        </div>
    )
}