"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";
import { motion } from "framer-motion";

const peraWallet = new PeraWalletConnect();

const algodClient = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  ""
);

export default function DashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("ai");
  const [account, setAccount] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [txId, setTxId] = useState("");
  const [credits, setCredits] = useState(0);
  const [receipt, setReceipt] = useState("");
  const [usageCount, setUsageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  // 🔐 CONNECT WALLET
  const connectWallet = async () => {
    try {
      const accounts = await peraWallet.connect();
      setAccount(accounts[0]);
    } catch {
      alert("Wallet connection failed");
    }
  };

  // 💰 PAYMENT (FIXED SDK ISSUE HERE)
  const handlePay = async () => {
    if (!account) return alert("Connect wallet first");

    try {
      setPaying(true);

      const params = await algodClient.getTransactionParams().do();

      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: account,      // ✅ FIXED
        receiver: account,    // ✅ FIXED
        amount: 100000,
        suggestedParams: params,
      });

      const encodedTxn = algosdk.encodeUnsignedTransaction(txn);

      const signedTxn = await peraWallet.signTransaction([
        { txn: encodedTxn },
      ]);

      const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

      setTxId(txId);

      await algosdk.waitForConfirmation(algodClient, txId, 4);

      setCredits((p) => p + 1);
      setReceipt("ALGO-" + Math.floor(Math.random() * 100000));

    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    } finally {
      setPaying(false);
    }
  };

  // ⚡ GENERATE
  const generate = async () => {
    if (credits <= 0) return alert("No credits");

    if (!prompt) return alert("Enter prompt");

    try {
      setLoading(true);

      const res = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      setResponse(data.result);
      setCredits((p) => p - 1);
      setUsageCount((p) => p + 1);

    } catch {
      alert("Error generating response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0B0F1A] text-white flex overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute w-[600px] h-[600px] bg-blue-500 opacity-20 blur-3xl rounded-full top-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-purple-500 opacity-20 blur-3xl rounded-full bottom-[-150px] right-[-100px]" />

      {/* SIDEBAR */}
      <div className="w-[240px] backdrop-blur-xl bg-white/5 border-r border-white/10 p-6 flex flex-col z-10">

        <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          ⚡ AlgoPay
        </h2>

        {[
          { key: "ai", label: "🧠 AI Generator" },
          { key: "payments", label: "💳 Payments" },
          { key: "usage", label: "📊 Usage" },
          { key: "profile", label: "👤 Profile" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`mb-3 p-3 rounded-xl text-left transition ${
              activeTab === item.key
                ? "bg-white/20 shadow"
                : "hover:bg-white/10 text-gray-400"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8 z-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="flex gap-3">
            <button
              onClick={connectWallet}
              className="bg-gray-800 px-4 py-2 rounded-lg"
            >
              {account ? "Wallet Connected" : "Connect Wallet"}
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("user");
                router.push("/login");
              }}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* AI PAGE */}
        {activeTab === "ai" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 p-4 rounded-xl">
                💰 Credits: {credits}
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                📊 Usage: {usageCount}
              </div>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl">

              <textarea
                className="w-full p-4 bg-[#1C2333]/80 rounded-xl mb-4"
                placeholder="Ask anything..."
                onChange={(e) => setPrompt(e.target.value)}
              />

              <div className="flex gap-4">
                <button
                  onClick={handlePay}
                  disabled={!account || paying}
                  className="flex-1 bg-green-500 py-3 rounded-xl"
                >
                  {paying ? "Processing..." : "💸 Buy Credit"}
                </button>

                <button
                  onClick={generate}
                  disabled={credits <= 0 || loading}
                  className="flex-1 bg-blue-500 py-3 rounded-xl"
                >
                  {loading ? "Generating..." : "⚡ Generate"}
                </button>
              </div>

              {response && (
                <div className="mt-6 bg-[#1C2333] p-4 rounded-xl">
                  {response}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* PAYMENTS */}
        {activeTab === "payments" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl mb-4">Payments</h2>

            {txId && (
              <div className="bg-white/5 p-4 rounded-xl">
                <p>{txId}</p>
                <a
                  href={`https://lora.algokit.io/testnet/transaction/${txId}`}
                  className="text-blue-400"
                >
                  View Transaction ↗
                </a>
              </div>
            )}

            {receipt && <p className="mt-3">Receipt: {receipt}</p>}
          </motion.div>
        )}

        {/* USAGE */}
        {activeTab === "usage" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl mb-4">Usage Analytics</h2>

            <div className="bg-white/5 p-6 rounded-xl">
              <div className="h-4 bg-gray-700 rounded">
                <div
                  className="h-4 bg-blue-500 rounded"
                  style={{ width: `${usageCount * 20}px` }}
                />
              </div>

              <p className="mt-2">{usageCount} requests used</p>
            </div>
          </motion.div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl mb-4">Profile</h2>

            <div className="bg-white/5 p-6 rounded-xl">
              <p>Email: {localStorage.getItem("user")}</p>
              <p>Wallet: {account || "Not connected"}</p>
            </div>
          </motion.div>
        )}

      </div>
    </main>
  );
}