export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Tag } from "@/models/Tag";
import { createSlug } from "@/lib/slug";
import { z } from "zod";

const tagSchema = z.object({
  name: z.string().min(2),
});

export async function GET() {
  await connectToDatabase();
  const tags = await Tag.find().sort({ name: 1 }).lean();
  return NextResponse.json({ data: tags });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const json = await request.json();
  const parsed = tagSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name } = parsed.data;
  const slug = createSlug(name);
  const tag = await Tag.findOneAndUpdate(
    { slug },
    { name, slug },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return NextResponse.json({ data: tag }, { status: 201 });
}

