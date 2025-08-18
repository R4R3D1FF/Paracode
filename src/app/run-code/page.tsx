'use client';
import { Editor } from "@monaco-editor/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const defaultCodes = {
    cpp:
`#include <iostream>
using namespace std;

int main(){
  cout << "My code goes here.\\n";
  return 0;
}`
  }

  const [code, setCode] = useState(defaultCodes["cpp"]);
  const [output, setOutput] = useState('');

  // useEffect(() =>{
  //   setCode(defaultCodes["cpp"]);
  // }, []);

  const handleRun = async () => {
    const res = await fetch('/api/coderun', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: "cpp", code }),
    });

    const data = await res.json();
    console.log(data);
    setOutput(data.message?.output || data.error);
  };

  

  return (
    <div className="mx-auto bg-white p-6 rounded-2xl shadow-xl h-screen flex">
      <div className="w-1/2 h-full flex flex-col border-r pr-6">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Code Runner</h1>

        <Editor
          defaultLanguage="cpp"
          value={code}
          onChange={(value) => setCode(value || "")}
          height="70%"
          defaultValue={defaultCodes["cpp"]}
          className="w-full p-4 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          theme="vs-light dark:vs-dark"
        />


        <button
          onClick={handleRun}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Run Code
        </button>
      </div>
      <div className="w-1/2 h-full flex flex-col pl-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Output</h1>
        <div className="min-h-1/3 mt-2 p-4 bg-gray-100 border border-gray-300 rounded-lg text-sm whitespace-pre overflow-auto font-mono">
          {output}
        </div>
      </div>
    </div>
  );
}
