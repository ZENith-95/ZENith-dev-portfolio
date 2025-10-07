export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { randomUUID } from "crypto";
import { extname } from "path";

import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
import { Upload } from "@/models/Upload";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "uploads";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const folder = formData.get("folder")?.toString().replace(/(^\/+)|(\/+?$)/g, "");
  const baseName = file.name ? file.name.replace(/\s+/g, "-") : "image";
  const extension = extname(baseName) || "";
  const uniqueName = `${randomUUID()}${extension}`;
  const objectPath = folder ? `${folder}/${uniqueName}` : uniqueName;

  const arrayBuffer = await file.arrayBuffer();
  const supabase = getSupabaseAdminClient();

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(objectPath, arrayBuffer, {
    contentType: file.type || undefined,
    upsert: false,
  });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);

  await connectToDatabase();
  const created = await Upload.create({
    filename: file.name || uniqueName,
    url: publicUrl,
    size: file.size,
    mimetype: file.type || "image",
    key: objectPath,
  });

  return NextResponse.json({
    data: {
      id: created._id.toString(),
      url: publicUrl,
      filename: created.filename,
      size: created.size,
      mimetype: created.mimetype,
      createdAt: created.createdAt?.toISOString?.() ?? new Date().toISOString(),
      path: objectPath,
    },
  });
}

export async function GET() {
  await connectToDatabase();
  const uploads = await Upload.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: uploads });
}

