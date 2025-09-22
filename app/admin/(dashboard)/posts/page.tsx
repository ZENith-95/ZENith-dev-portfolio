import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Post } from "@/models/Post";

interface PostsPageProps {
  searchParams: {
    q?: string;
    status?: string;
    tag?: string;
  };
}

const statusBadges: Record<string, string> = {
  published: "bg-emerald-500/20 text-emerald-200",
  draft: "bg-amber-500/20 text-amber-200",
};

export default async function AdminPostsPage({ searchParams }: PostsPageProps) {
  await connectToDatabase();

  const query: Record<string, unknown> = {};
  if (searchParams.status && ["draft", "published"].includes(searchParams.status)) {
    query.status = searchParams.status;
  }
  if (searchParams.tag) {
    query.tags = searchParams.tag;
  }
  if (searchParams.q) {
    query.$or = [
      { title: { $regex: searchParams.q, $options: "i" } },
      { summary: { $regex: searchParams.q, $options: "i" } },
    ];
  }

  const posts = await Post.find(query)
    .sort({ updatedAt: -1 })
    .limit(50)
    .lean();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Posts</h1>
          <p className="text-sm text-white/60">Manage published articles, drafts, and featured content.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center rounded-full border border-purple-500/40 bg-purple-500/20 px-5 py-2 text-sm font-medium text-purple-100 transition hover:bg-purple-500/30"
        >
          + Create post
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5 text-xs uppercase tracking-widest text-white/50">
            <tr>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Updated</th>
              <th className="px-6 py-4 text-left">Tags</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-white/80">
            {posts.map((post) => (
              <tr key={post._id.toString()} className="hover:bg-white/5">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{post.title}</div>
                  <div className="text-xs text-white/40 line-clamp-1">{post.summary}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs ${statusBadges[post.status] ?? "bg-white/10 text-white/60"}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/60">
                  {new Date(post.updatedAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-white/60">
                  {post.tags?.length ? post.tags.join(", ") : "—"}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/posts/${post._id.toString()}/edit`}
                    className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/70 transition hover:border-purple-400 hover:text-white"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-white/60">
                  No posts match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

