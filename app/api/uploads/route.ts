export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Upload } from "@/models/Upload";

export async function POST() {
  return NextResponse.json({ error: "Uploads are handled via UploadThing." }, { status: 405 });
}

export async function GET() {
  await connectToDatabase();
  const uploads = await Upload.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: uploads });
}
