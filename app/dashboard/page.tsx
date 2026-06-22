"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, LogOut, User, ArrowRightLeft, TrendingUp, } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userMetadata, setUserMetadata] = useState<{ first_name?: string; last_name?: string } | null>(null);
  const balance = 5400.00;
  
  const recentTransactions = [
    { id: 1, name: "Kiraly Llanda", type: "send", amount: 1500.00, date: "Today, 2:30 PM" },
    { id: 2, name: "Maryanne Pablo", type: "receive", amount: 3000.00, date: "Yesterday, 10:15 AM" },
    { id: 3, name: "Yami Sukehiro", type: "send", amount: 450.00, date: "June 19, 4:20 PM" },
    { id: 4, name: "John Doe", type: "send", amount: 1500.00, date: "Today, 2:30 PM" },
    { id: 5, name: "Jane Smith", type: "receive", amount: 3000.00, date: "Yesterday, 10:15 AM" },
    { id: 6, name: "Anonymous User", type: "send", amount: 450.00, date: "June 19, 4:20 PM" },
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        toast.error("You must be logged in to access the dashboard.");
        router.push("/login");
      } else {
        setUserMetadata(user.user_metadata as { first_name?: string; last_name?: string });
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  // Handle Logout Function
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed. Please try again.");
    } else {
      toast.success("Logged out successfully.");
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-sm font-medium text-neutral-500 animate-pulse">Loading your S-Wallet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pb-12">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-neutral-200/80 sticky top-0 z-40">
        <div className="max-w mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black italic tracking-widest text-indigo-600 uppercase">S-Wallet</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-6 mt-6 space-y-6">
        {/* WELCOME BANNER */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-neutral-200/60 shadow-sm shadow-neutral-100">
          <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Welcome back,</p>
            <h2 className="text-sm font-bold text-neutral-800">
              {userMetadata?.first_name || "User"} {userMetadata?.last_name || ""}
            </h2>
          </div>
        </div>

        {/* BALANCE CARD */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-3xl p-6 shadow-xl shadow-indigo-600/20 overflow-hidden">

          <p className="text-xs font-medium text-indigo-200/90 flex items-center gap-1.5 mb-1.5">
            <Wallet className="h-3.5 w-3.5" />
            Current Balance
          </p>
          <h1 className="text-3xl font-black tracking-tight mb-6">
            ₱{balance.toLocaleString("en-Ph", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </h1>
          <p className="text-sm text-indigo-200/90">
            Your available balance across all accounts
          </p>
        </div>

        {/* RECENT TRANSACTIONS SECTION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <ArrowRightLeft className="h-3.5 w-3.5" /> Recent Transactions
            </h3>
            <span className="text-[11px] font-semibold text-indigo-600 hover:underline cursor-pointer">See all</span>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:none [-ms-overflow-style:none] [scrollbar-width:none]">
            {recentTransactions.map((tx) => (
              <div 
                key={tx.id} 
                className="bg-white border border-neutral-200/60 p-4 rounded-2xl flex items-center justify-between shadow-sm shadow-neutral-100/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                    tx.type === "receive" ? "bg-emerald-50 text-emerald-600" : "bg-neutral-50 text-neutral-600"
                  }`}>
                    {tx.type === "receive" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-800">{tx.name}</p>
                    <p className="text-[10px] text-neutral-400 font-medium">{tx.date}</p>
                  </div>
                </div>
                <p className={`text-xs font-bold ${
                  tx.type === "receive" ? "text-emerald-600" : "text-neutral-800"
                }`}>
                  {tx.type === "receive" ? "+" : "-"} ₱{tx.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}