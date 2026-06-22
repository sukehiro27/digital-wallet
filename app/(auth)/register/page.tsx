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

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match! Please verify your password.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });

    if(error) {
      toast.error(error.message);
      return;
    }

    toast.success(`Account created successfully for ${firstName}!`);

    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center p-6 w-full font-sans">
      <Card className="w-full max-w-md bg-white border-neutral-200/80 rounded-3xl shadow-xl shadow-neutral-200/50">
        <CardHeader className="text-center space-y-1.5 pt-8">
          <span className="text-xs font-black italic tracking-widest text-indigo-600 uppercase">S-Wallet</span>
          <CardTitle className="text-2xl font-bold tracking-tight text-neutral-900">Create Account</CardTitle>
          <CardDescription className="text-xs text-neutral-500">
            Sign up to start managing your digital assets
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 gap-3">

              {/* FirstName FIELD */}
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-semibold text-neutral-600">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="bg-neutral-50 border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus-visible:ring-1 focus-visible:ring-indigo-600" required />
              </div>

              {/* LasttName FIELD */}
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-semibold text-neutral-600">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="bg-neutral-50 border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus-visible:ring-1 focus-visible:ring-indigo-600" required />
              </div>

              {/* EMAIL FIELD */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-neutral-600">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="bg-neutral-50 border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-900 focus-visible:ring-1 focus-visible:ring-indigo-600" required />
              </div>

              {/* PASSWORD FIELD */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-neutral-600">Password</Label>
                <div className="relative flex items-center">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-neutral-50 border-neutral-200 rounded-xl px-4 py-3 pr-12 text-sm text-neutral-900 focus-visible:ring-1 focus-visible:ring-indigo-600 placeholder:text-neutral-400 w-full" required />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-neutral-400 hover:text-neutral-600 focus:outline-none cursor-pointer flex items-center justify-center"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD FIELD */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold text-neutral-600">Confirm Password</Label>
                <div className="relative flex items-center">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-neutral-50 border-neutral-200 rounded-xl px-4 py-3 pr-12 text-sm text-neutral-900 focus-visible:ring-1 focus-visible:ring-indigo-600 placeholder:text-neutral-400 w-full" required />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-neutral-400 hover:text-neutral-600 focus:outline-none cursor-pointer flex items-center justify-center"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-6 rounded-full transition-all active:scale-98 mt-2 shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              Get Started
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center pb-8">
          <p className="text-xs text-neutral-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );

}