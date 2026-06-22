"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ArrowLeft, Send, Landmark } from "lucide-react";

export default function SendMoney() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("GCash");

  const phWallets = ["GCash", "Maya", "GrabPay", "BDO", "BPI"];

  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName || !amount) {
      toast.error("Please fill in all fields.");
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
          name: `${recipientName} (${selectedWallet})`,
          type: "send",
          amount: parseFloat(amount),
        },
      ]);

    if (error) {
      toast.error("Transaction failed: " + error.message);
      setLoading(false);
      return;
    }

    toast.success(`Successfully sent ₱${parseFloat(amount).toFixed(2)} to ${recipientName}!`);
    
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
          <h1 className="text-sm font-bold text-neutral-800">Send Money</h1>
        </header>

        {/* FORM CONTAINER */}
        <main className="max-w-md mx-auto px-6 mt-6">
          <form onSubmit={handleSendMoney} className="bg-white border border-neutral-200/60 p-6 rounded-2xl shadow-sm space-y-5">
            
            {/* SELECT E-WALLET / BANK */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Landmark className="h-3.5 w-3.5" /> Select Destination
              </label>
              <div className="grid grid-cols-3 gap-2">
                {phWallets.map((wallet) => (
                  <button
                    type="button"
                    key={wallet}
                    onClick={() => setSelectedWallet(wallet)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      selectedWallet === wallet
                        ? "bg-indigo-50 border-indigo-500 text-indigo-600"
                        : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                    }`}
                  >
                    {wallet}
                  </button>
                ))}
              </div>
            </div>

            {/* RECIPIENT NAME */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Account Name / Number</label>
              <input
                type="text"
                placeholder="e.g. Kiraly Llanda o 09123456789"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-indigo-500 font-medium transition-colors"
              />
            </div>

            {/* AMOUNT */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Amount (PHP)</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-xs font-bold text-neutral-400">₱</span>
                <input
                  type="number"
                  placeholder="0.00"
                  step="any"
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white text-xs font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10 mt-2"
            >
              <Send className="h-4 w-4" />
              {loading ? "Processing Transfer..." : "Confirm Send"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}