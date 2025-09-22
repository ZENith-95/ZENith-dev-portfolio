import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Upload } from "@/models/Upload";
import { promises as fs } from "fs";
import { join } from "path";

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

  if (upload.url) {
    const filePath = join(process.cwd(), "public", upload.url.replace(/^\//, ""));
    await fs.unlink(filePath).catch(() => null);
  }

  return NextResponse.json({ success: true });
}
