"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
      callbackUrl: "/admin",
    });

    if (res?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else if (res?.ok) {
      window.location.href = res.url ?? "/admin";
    } else {
      setLoading(false);
      setError("Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-black" />
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative flex w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_50px_rgba(139,92,246,0.25)]">
        <div className="hidden md:flex flex-1 flex-col justify-between p-10 bg-white/5 backdrop-blur-xl">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-widest text-white/70">
              Admin Access
            </span>
            <h1 className="mt-6 text-4xl font-bold text-white">
              Welcome back, creator.
            </h1>
            <p className="mt-4 text-sm text-white/70 max-w-sm">
              Sign in with your secure admin credentials to publish new stories, update projects, and manage your digital universe.
            </p>
          </div>
          <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10">
            <Image src="/bg.png" alt="Admin hero" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30" />
            <div className="absolute bottom-4 left-4 text-sm text-white/80">
              Elevate your narrative.
            </div>
          </div>
        </div>
        <div className="flex-1 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-white">Admin Login</h2>
            <p className="mt-2 text-sm text-white/60">
              Enter your credentials to manage the Zenith blog.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40"
                placeholder="zenichi_95"
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition group-hover:translate-x-full" />
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="mt-10 text-xs text-white/40">
            <p>
              Need help? <Link href="mailto:dz.korbla@gmail.com" className="text-purple-300 hover:underline">Contact support</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


