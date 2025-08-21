"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function ProblemForm({ existing }: { existing?: any }) {
  const [formData, setFormData] = useState({
    title: existing?.title || "",
    content: existing?.content || "",
    driver_code_c: existing?.driver_code_c || "",
    driver_code_cpp: existing?.driver_code_cpp || "",
    driver_code_python: existing?.driver_code_python || "",
    driver_code_java: existing?.driver_code_java || "",
    solution_code_cpp: existing?.solution_code_cpp || "",
    testcases: existing?.testcases || "",
    difficulty: existing?.difficulty || "Easy",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (value: string | undefined, field: string) => {
    setFormData({ ...formData, [field]: value || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = formData.id ? "PUT" : "POST";
    const url = formData.id ? `/api/problems/${formData.id}` : "/api/problems";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Problem saved successfully!");
    } else {
      alert("Error saving problem");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 border rounded-xl shadow">
      {/* Title */}
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full p-2 border rounded"
      />

      {/* Content */}
      <textarea
        name="content"
        value={formData.content}
        onChange={(e) => handleChange(e)}
        placeholder="Problem description"
        className="w-full p-2 border rounded h-24"
      />

      {/* Driver Code (C++) */}
      <div>
        <label className="block font-medium mb-1">Driver Code (C++)</label>
        <Editor
          height="200px"
          defaultLanguage="cpp"
          value={formData.driver_code_cpp}
          onChange={(val) => handleEditorChange(val, "driver_code_cpp")}
          theme="vs-dark"
        />
      </div>

      {/* Solution Code (C++) */}
      <div>
        <label className="block font-medium mb-1">Solution Code (C++)</label>
        <Editor
          height="300px"
          defaultLanguage="cpp"
          value={formData.solution_code_cpp}
          onChange={(val) => handleEditorChange(val, "solution_code_cpp")}
          theme="vs-dark"
        />
      </div>

      {/* Testcases */}
      <div>
        <label className="block font-medium mb-1">Testcases</label>
        <Editor
          height="200px"
          defaultLanguage="plaintext"
          value={formData.testcases}
          onChange={(val) => handleEditorChange(val, "testcases")}
          theme="vs-light"
        />
      </div>

      {/* Difficulty */}
      <select
        name="difficulty"
        value={formData.difficulty}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      {/* Submit */}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        {formData.id ? "Update Problem" : "Create Problem"}
      </button>
    </form>
  );
}
