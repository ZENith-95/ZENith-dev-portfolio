export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveFileFromFormData } from "@/lib/upload";
import { connectToDatabase } from "@/lib/db";
import { Upload } from "@/models/Upload";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const saved = await saveFileFromFormData(file);
  await connectToDatabase();
  const upload = await Upload.create({
    filename: saved.filename,
    url: saved.url,
    size: saved.size,
    mimetype: saved.mimetype,
  });

  return NextResponse.json({ data: upload }, { status: 201 });
}

export async function GET() {
  await connectToDatabase();
  const uploads = await Upload.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: uploads });
}
