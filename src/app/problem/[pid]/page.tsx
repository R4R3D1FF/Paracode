// 'use client';
import SubmitForm from "@/components/submit-form";
import { Editor } from "@monaco-editor/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default async function Problem({ params }: any) {
    const pid = Number(await params.pid);
    console.log(pid);
    const defaultCodes = {
        cpp:
            `#include <iostream>
using namespace std;

int main(){
    cout << "My code goes here.\\n";
    return 0;
}`
    }

    const { title, content } = await (await fetch(`${process.env.API_BASE_URL}/problem/${pid}`)).json();

    // const [code, setCode] = useState('');
    // const [output, setOutput] = useState('');

    // useEffect(() => {
    //     setCode(defaultCodes["cpp"]);
    // })

    // const handleRun = async () => {
    //     const res = await fetch('/api/coderun', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ language: "cpp", code }),
    //     });

    //     const data = await res.json();
    //     console.log(data);
    //     setOutput(data.message || data.error);
    // };z

    return (
        <div className="mx-auto bg-white p-6 rounded-2xl shadow-xl flex justify-center">
            <div className="w-1/2 border-r pr-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    {title}
                </h1>

                <div>
                    {content}
                </div>
            </div>
            <SubmitForm className="w-1/2 pl-6" problem_id={pid}/>

        </div>
    );
}
