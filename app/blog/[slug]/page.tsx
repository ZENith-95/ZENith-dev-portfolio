import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Post } from "@/models/Post";
import { Tag } from "@/models/Tag";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: { slug: string };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  await connectToDatabase();
  const post = await Post.findOne({ slug: params.slug, status: "published" }).lean();
  if (!post) {
    notFound();
  }
  const tagDocs = await Tag.find({ slug: { $in: post.tags ?? [] } }).lean();
  const tags = tagDocs.map((tag) => tag.name);

  return (
    <article className="relative min-h-screen bg-gradient-to-br from-black via-slate-950 to-purple-950 pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.25)_0%,_rgba(0,0,0,0)_55%)]" />
      <div className="relative z-10 px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Link href="/blog" className="w-fit rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.4em] text-white/50 transition hover:border-purple-300 hover:text-white">
              Back to blog
            </Link>
            <div>
              <h1 className="text-4xl font-semibold text-white md:text-5xl">{post.title}</h1>
              <p className="mt-4 max-w-3xl text-lg text-white/70">{post.summary}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
                <span>{new Date(post.publishedAt ?? post.createdAt).toLocaleDateString()}</span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                {tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {post.coverImage && (
            <div className="relative h-80 w-full overflow-hidden rounded-[3rem] border border-white/10">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
            </div>
          )}

          <div className="prose prose-invert max-w-none leading-relaxed prose-headings:text-white prose-p:text-white/70 prose-a:text-purple-300 prose-strong:text-white prose-blockquote:border-purple-500/40 prose-blockquote:text-purple-100">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </div>
    </article>
  );
}
