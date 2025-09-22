export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Upload } from "@/models/Upload";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const upload = await Upload.findByIdAndDelete(params.id).lean();
  if (!upload) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (upload.key) {
    await utapi.deleteFiles(upload.key).catch(() => null);
  }

  return NextResponse.json({ success: true });
}
