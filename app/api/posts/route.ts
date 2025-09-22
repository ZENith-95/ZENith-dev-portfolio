import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Post } from "@/models/Post";
import { Tag } from "@/models/Tag";
import { createSlug } from "@/lib/slug";
import { z } from "zod";

const postPayloadSchema = z.object({
  title: z.string().min(3),
  summary: z.string().min(10),
  content: z.string().min(10),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().optional().default(false),
  slug: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
});

export async function GET(request: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const featured = searchParams.get("featured") === "true" ? true : undefined;
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;

  const query: Record<string, unknown> = {};
  if (status && ["draft", "published"].includes(status)) {
    query.status = status;
  }
  if (tag) {
    query.tags = tag;
  }
  if (featured !== undefined) {
    query.featured = featured;
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { summary: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    Post.find(query)
      .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Post.countDocuments(query),
  ]);

  return NextResponse.json({
    data: items,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const json = await request.json();
  const parsed = postPayloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const slug = payload.slug ? createSlug(payload.slug) : createSlug(payload.title);

  const existingSlug = await Post.findOne({ slug });
  if (existingSlug) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  if (payload.tags?.length) {
    await Tag.bulkWrite(
      payload.tags.map((tagName) => ({
        updateOne: {
          filter: { slug: createSlug(tagName) },
          update: { $setOnInsert: { name: tagName, slug: createSlug(tagName) } },
          upsert: true,
        },
      }))
    );
  }

  const post = await Post.create({
    ...payload,
    slug,
    tags: payload.tags ?? [],
    publishedAt: payload.status === "published" ? payload.publishedAt ? new Date(payload.publishedAt) : new Date() : undefined,
  });

  return NextResponse.json({ data: post }, { status: 201 });
}

