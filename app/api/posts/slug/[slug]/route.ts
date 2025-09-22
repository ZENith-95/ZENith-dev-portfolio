import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Post } from "@/models/Post";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  await connectToDatabase();
  const post = await Post.findOne({ slug: params.slug, status: "published" }).lean();
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: post });
}
