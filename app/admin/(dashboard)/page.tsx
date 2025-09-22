import { connectToDatabase } from "@/lib/db";
import { Post } from "@/models/Post";
import { Tag } from "@/models/Tag";
import { Upload } from "@/models/Upload";
import Link from "next/link";

export default async function AdminDashboardPage() {
  await connectToDatabase();

  const [totalPosts, publishedPosts, draftPosts, featuredPosts, tagsCount, uploadsCount] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ status: "published" }),
    Post.countDocuments({ status: "draft" }),
    Post.countDocuments({ featured: true }),
    Tag.countDocuments(),
    Upload.countDocuments(),
  ]);

  const latestPosts = await Post.find().sort({ createdAt: -1 }).limit(5).lean();

  return (
    <div className="space-y-10">
      <section className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Total Posts", value: totalPosts, href: "/admin/posts" },
          { label: "Published", value: publishedPosts, href: "/admin/posts?status=published" },
          { label: "Drafts", value: draftPosts, href: "/admin/posts?status=draft" },
          { label: "Featured", value: featuredPosts, href: "/admin/posts?featured=true" },
          { label: "Tags", value: tagsCount, href: "/admin/posts" },
          { label: "Assets", value: uploadsCount, href: "/admin/uploads" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-purple-400 hover:bg-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">{item.label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Latest activity</h2>
            <p className="text-sm text-white/60">Recently created or updated posts</p>
          </div>
          <Link
            href="/admin/posts"
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-white/60 transition hover:border-purple-400 hover:text-white"
          >
            View all
          </Link>
        </div>
        <div className="mt-6 space-y-4">
          {latestPosts.map((post) => (
            <Link
              key={post._id.toString()}
              href={`/admin/posts/${post._id.toString()}/edit`}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-white/80 transition hover:border-purple-400 hover:bg-white/10 hover:text-white"
            >
              <div>
                <p className="font-medium text-white">{post.title}</p>
                <p className="text-xs text-white/50">
                  {post.status?.toUpperCase()} · {new Date(post.updatedAt).toLocaleString()}
                </p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                {post.tags?.slice(0, 2).join(", ") || "No tags"}
              </span>
            </Link>
          ))}
          {latestPosts.length === 0 && (
            <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-white/60">
              No posts yet. <Link href="/admin/posts/new" className="text-purple-300 hover:underline">Create one now.</Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}


