"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);
  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-500 text-xs font-mono">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
        Connecting to S-Wallet...
      </div>
    </main>
  );
}
