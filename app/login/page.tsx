"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    // simulate login delay
    setTimeout(() => {
      localStorage.setItem("user", email); // simple session
      router.push("/dashboard");
    }, 800);
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#0B0F1A] text-white overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 blur-3xl rounded-full top-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500 opacity-20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

      {/* LOGIN CARD */}
      <div className="z-10 backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl w-[350px]">

        <h2 className="text-3xl font-bold mb-2 text-center">
          🔐 Welcome Back
        </h2>

        <p className="text-gray-400 text-sm text-center mb-6">
          Login to access AlgoPay AI
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-[#1C2333]/80 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded bg-[#1C2333]/80 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-gray-500 text-xs text-center mt-4">
          Demo login (no backend auth)
        </p>

      </div>
    </main>
  );
}