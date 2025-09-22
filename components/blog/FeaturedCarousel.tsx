"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export type FeaturedPost = {
  slug: string;
  title: string;
  summary: string;
  coverImage?: string;
  tags: string[];
  publishedAt?: string;
};

interface FeaturedCarouselProps {
  posts: FeaturedPost[];
  intervalMs?: number;
}

export function FeaturedCarousel({ posts, intervalMs = 7000 }: FeaturedCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (posts.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % posts.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [posts.length, intervalMs]);

  if (posts.length === 0) {
    return null;
  }

  const current = posts[index];
  const previous = posts[(index - 1 + posts.length) % posts.length];
  const next = posts[(index + 1) % posts.length];

  return (
    <section className="relative mx-auto flex max-w-6xl flex-col gap-6 py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,2fr)_1fr]">
        <SideCard post={previous} position="left" />
        <MainHeroCard post={current} />
        <SideCard post={next} position="right" />
      </div>
      <div className="flex justify-center gap-2">
        {posts.map((_, i) => (
          <button
            key={i}
            aria-label={`Show slide ${i + 1}`}
            className={`h-2 w-10 rounded-full transition ${i === index ? "bg-purple-400" : "bg-white/20"}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}

function MainHeroCard({ post }: { post: FeaturedPost }) {
  return (
    <div className="group relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 p-10 backdrop-blur-3xl">
      <div className="absolute -inset-1 rounded-[3rem] bg-gradient-to-r from-purple-500/30 via-purple-400/10 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.4em] text-white/70">
          Featured story
          <span className="h-2 w-2 rounded-full bg-purple-300" />
        </div>
        <h2 className="text-4xl font-semibold text-white md:text-5xl">{post.title}</h2>
        <p className="max-w-xl text-base text-white/70 md:text-lg">{post.summary}</p>
        <div className="flex flex-wrap gap-3">
          {post.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-1 text-xs text-purple-100">
              #{tag}
            </span>
          ))}
        </div>
        <div className="relative h-64 w-full overflow-hidden rounded-[2.5rem] border border-white/10">
          {post.coverImage ? (
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-black/40 text-white/40">No cover</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent" />
          <div className="absolute bottom-6 left-6">
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:border-purple-300 hover:bg-purple-400/30"
            >
              Read article
              <span aria-hidden>?</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideCard({ post, position }: { post: FeaturedPost; position: "left" | "right" }) {
  if (!post) return <div className="hidden lg:block" />;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative hidden overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl transition hover:border-purple-400 hover:bg-white/10 lg:flex ${position === "left" ? "justify-end" : "justify-start"}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/10 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className={`relative flex max-w-xs flex-col gap-4 ${position === "left" ? "text-right" : "text-left"}`}>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Up next</p>
        <h3 className="text-xl font-semibold text-white">{post.title}</h3>
        <p className="line-clamp-3 text-sm text-white/60">{post.summary}</p>
        <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
