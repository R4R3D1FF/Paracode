"use client"

import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Mail, Lock } from "lucide-react";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: any) => {
    // e.preventDefault();
    // console.log("Register with:", { username, password });
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username, password}),
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm shadow-xl rounded-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="flex items-center gap-2">
                {/*<Mail size={16} /> */} Username
              </label>
              <input
                id="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="flex items-center gap-2">
                {/* <Lock size={16} /> */} Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="w-full mt-4">
              Sign In
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Don’t have an account? <a href="#" className="text-blue-600 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
