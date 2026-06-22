"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ArrowLeft, PlusCircle } from "lucide-react";

export default function ReceiveMoney() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("GCash");

  const handleReceiveMoney = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount) {
      toast.error("Please enter an amount.");
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than 0.");
      return;
    }

    setLoading(true);

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      toast.error("User session not found. Please log in again.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.id,
          name: `${source} Cash-In`,
          type: "receive",
          amount: parseFloat(amount),
        },
      ]);

    if (error) {
      toast.error("Cash-In failed: " + error.message);
      setLoading(false);
      return;
    }

    toast.success(`Successfully received ₱${parseFloat(amount).toFixed(2)} via ${source}!`);
    
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans flex flex-col justify-between pb-8">
      <div>
        {/* HEADER */}
        <header className="bg-white border-b border-neutral-200/80 h-16 flex items-center px-6 sticky top-0 z-40">
          <button onClick={() => router.push("/dashboard")} className="text-neutral-500 hover:text-neutral-900 mr-4 cursor-pointer">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-bold text-neutral-800">Receive Money / Cash-In</h1>
        </header>

        {/* FORM CONTAINER */}
        <main className="max-w-md mx-auto px-6 mt-6">
          <form onSubmit={handleReceiveMoney} className="bg-white border border-neutral-200/60 p-6 rounded-2xl shadow-sm space-y-5">
            
            {/* SOURCE SELECTOR */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Select Cash-In Source</label>
              <select 
                value={source} 
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-indigo-500 font-bold text-neutral-700 cursor-pointer"
              >
                <option value="GCash">GCash</option>
                <option value="Maya">Maya</option>
                <option value="Over-the-Counter">Over-the-Counter (7-Eleven)</option>
              </select>
            </div>

            {/* AMOUNT */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Amount to Add (PHP)</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-xs font-bold text-neutral-400">₱</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-neutral-300 text-white text-xs font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/10 mt-2"
            >
              <PlusCircle className="h-4 w-4" />
              {loading ? "Processing Cash-In..." : "Confirm Receive"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}