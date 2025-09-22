export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Post } from "@/models/Post";
import { Tag } from "@/models/Tag";
import { createSlug } from "@/lib/slug";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  summary: z.string().min(10).optional(),
  content: z.string().min(10).optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published"]).optional(),
  featured: z.boolean().optional(),
  slug: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
});

async function ensureAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const post = await Post.findById(params.id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: post });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureAdmin();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const json = await request.json();
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updateData = parsed.data;
  if (updateData.tags?.length) {
    await Tag.bulkWrite(
      updateData.tags.map((tagName) => ({
        updateOne: {
          filter: { slug: createSlug(tagName) },
          update: { $setOnInsert: { name: tagName, slug: createSlug(tagName) } },
          upsert: true,
        },
      }))
    );
  }

  if (updateData.slug) {
    updateData.slug = createSlug(updateData.slug);
  }


  if (updateData.status === "published") {
    (updateData as any).publishedAt = updateData.publishedAt ? new Date(updateData.publishedAt) : new Date();
  } else if (updateData.status === "draft") {
    (updateData as any).publishedAt = null;
  }
  const post = await Post.findByIdAndUpdate(params.id, updateData, { new: true });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: post });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await ensureAdmin();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  await Post.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}




