"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if(error) {
      toast.error(error.message);
      return;
    }
    const firstName = data.user?.user_metadata?.first_name || "User";

    toast.success(`Welcome back!, ${firstName}! Login successful.`);

    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center p-6 w-full">

      <Card className="w-full max-w-md bg-white border-neutral-200/80 rounded-3xl shadow-xl shadow-neutral-200/50">
        <CardHeader className="text-center space-y-1.5 pt-8">
          <span className="text-xs font-black italic tracking-widest text-indigo-600 uppercase">S-Wallet</span>
          <CardTitle className="text-2xl font-bold tracking-tight text-neutral-900">Welcome Back</CardTitle>
          <CardDescription className="text-xs text-neutral-500">
            Please enter your details to sign in
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL FIELD */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-neutral-600">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="bg-neutral-50 border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus-visible:ring-1 focus-visible:ring-indigo-600 placeholder:text-neutral-400"
                required
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-semibold text-neutral-600">Password</Label>
              </div>
              <div className="relative flex items-center">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-neutral-50 border-neutral-200 rounded-xl px-4 py-3 pr-12 text-sm text-neutral-900 focus-visible:ring-1 focus-visible:ring-indigo-600 placeholder:text-neutral-400 w-full"
                required
              />

              <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-neutral-400 hover:text-neutral-600 focus:outline-none cursor-pointer flex items-center justify-center block z-10">
                {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
              </button>
              </div>
            </div>

            {/* SIGN IN BUTTON */}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-6 rounded-full transition-all active:scale-98 mt-2 shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              Sign In
            </Button>

            <a href="/forgot-password" className="text-[12px] text-indigo-600 hover:underline font-large cursor-pointer flex justify-center">
              Forgot your password?
            </a>
          </form>
        </CardContent>

        <CardFooter className="justify-center pb-8">
          <p className="text-xs text-neutral-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-indigo-600 hover:underline font-semibold">
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>

    </main>
    
  );
}