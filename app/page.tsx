"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen bg-[#0B0F1A] text-white flex flex-col items-center justify-center text-center px-6 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500 opacity-20 blur-3xl rounded-full top-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-green-500 opacity-20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

      {/* NAVBAR */}
      <div className="absolute top-6 w-full max-w-6xl flex justify-between items-center px-6">
        <h1 className="text-xl font-bold">⚡ AlgoPay</h1>
        <button
          onClick={() => router.push("/login")}
          className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Login
        </button>
      </div>

      {/* HERO */}
      <div className="z-10 max-w-3xl">

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Pay-per-use AI with Algorand
        </h1>

        <p className="text-gray-400 text-lg mb-8">
          Unlock premium AI responses using blockchain micropayments.  
          No subscriptions. Only pay when you use.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex gap-4 justify-center">

          <button
            onClick={() => router.push("/login")}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 rounded-xl font-semibold hover:scale-[1.05] transition"
          >
            Get Started →
          </button>

          <button
            className="bg-white/10 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition"
          >
            Learn More
          </button>

        </div>

      </div>

      {/* FEATURES */}
      <div className="z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl">

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          ⚡ Instant Payments
          <p className="text-gray-400 text-sm mt-2">
            Powered by Algorand blockchain
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          🔐 Secure Access
          <p className="text-gray-400 text-sm mt-2">
            On-chain verified usage
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          💡 Pay-per-use
          <p className="text-gray-400 text-sm mt-2">
            No subscriptions, only usage-based billing
          </p>
        </div>

      </div>

    </main>
  );
}