import { promises as fs } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

export async function saveFileFromFormData(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadDir = join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const extension = file.name?.split(".").pop() ?? "bin";
  const filename = `${randomUUID()}.${extension}`;
  const filePath = join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);

  return {
    filename,
    url: `/uploads/${filename}`,
    size: buffer.byteLength,
    mimetype: file.type,
  };
}
