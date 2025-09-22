import Link from "next/link";
import { FeaturedCarousel, type FeaturedPost } from "@/components/blog/FeaturedCarousel";
import { connectToDatabase } from "@/lib/db";
import { Post } from "@/models/Post";
import { Tag } from "@/models/Tag";

export const dynamic = "force-dynamic";

interface BlogPageProps {
  searchParams: {
    q?: string;
    tag?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  await connectToDatabase();
  const tag = searchParams.tag;
  const searchText = searchParams.q;

  const tagDocs = await Tag.find().sort({ name: 1 }).lean();
  const allTags = tagDocs.map((tag) => tag.name);

  const query: Record<string, unknown> = { status: "published" };
  if (tag) {
    query.tags = tag;
  }
  if (searchText) {
    query.$or = [
      { title: { $regex: searchText, $options: "i" } },
      { summary: { $regex: searchText, $options: "i" } },
      { content: { $regex: searchText, $options: "i" } },
    ];
  }

  const posts = await Post.find(query)
    .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
    .lean();

  const carouselPosts: FeaturedPost[] = posts.slice(0, 5).map((post) => ({
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    coverImage: post.coverImage,
    tags: (post.tags ?? []).slice(0, 4),
    publishedAt: post.publishedAt?.toISOString(),
  }));

  const remainingPosts = posts.slice(5);
  const featuredSource = carouselPosts.length > 0 ? carouselPosts : posts.slice(0, 3).map((post) => ({
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    coverImage: post.coverImage,
    tags: post.tags ?? [],
    publishedAt: post.publishedAt?.toISOString(),
  }));

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-950 to-purple-950 pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.25)_0%,_rgba(0,0,0,0)_55%)]" />
      <div className="relative z-10">
        <FeaturedCarousel posts={featuredSource} />

        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6">
          <form className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Explore the blog</h2>
              <p className="text-sm text-white/60">Search by keyword, or discover topics through tags.</p>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
              <input
                type="text"
                name="q"
                defaultValue={searchText ?? ""}
                placeholder="Search articles..."
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
              />
              <button className="rounded-2xl border border-purple-500/40 bg-purple-500/30 px-5 py-3 text-sm text-purple-100 transition hover:bg-purple-500/40">
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tagName) => {
              const isActive = tag === tagName;
              const params = new URLSearchParams();
              if (searchText) params.set("q", searchText);
              if (!isActive && tagName) {
                params.set("tag", tagName);
              }
              const queryString = params.toString();
              const href = queryString ? `/blog?${queryString}` : "/blog";
              return (
                <Link
                  key={tagName}
                  href={href}
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                    isActive
                      ? "border-purple-400 bg-purple-500/30 text-purple-100"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-purple-300 hover:text-white"
                  }`}
                >
                  #{tagName}
                </Link>
              );
            })}
          </div>

          <section className="grid gap-6 md:grid-cols-2">
            {remainingPosts.map((post) => (
              <Link
                key={post._id.toString()}
                href={`/blog/${post.slug}`}
                className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-6 transition hover:border-purple-300 hover:bg-white/10"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
                    <span>{new Date(post.publishedAt ?? post.createdAt).toLocaleDateString()}</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>{post.tags?.slice(0, 3).join(' / ') ?? 'Journal'}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{post.title}</h3>
                  <p className="text-sm text-white/60 line-clamp-3">{post.summary}</p>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/70 transition group-hover:border-purple-400 group-hover:text-white">
                    Read article <span aria-hidden>&rarr;</span>
                  </span>
                </div>
              </Link>
            ))}
            {remainingPosts.length === 0 && (
              <div className="col-span-full rounded-[2.5rem] border border-dashed border-white/10 bg-white/5 px-6 py-16 text-center text-sm text-white/60">
                No posts found. Try adjusting your filters.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
