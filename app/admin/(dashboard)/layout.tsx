import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/posts/new", label: "New Post" },
  { href: "/admin/uploads", label: "Assets" },
];

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-purple-950">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Zenith Control Room</p>
            <h1 className="text-xl font-semibold text-white">Admin Suite</h1>
          </div>
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:border-purple-400 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:border-red-400 hover:text-red-200"
              >
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}

