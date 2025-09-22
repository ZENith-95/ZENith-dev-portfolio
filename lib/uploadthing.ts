import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { Upload } from "@/models/Upload";

const f = createUploadthing();

export const uploadRouter = {
  blogImage: f({ image: { maxFileSize: "8MB" } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session || (session.user as any)?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return { userId: session.user?.name ?? "admin" };
    })
    .onUploadComplete(async ({ file }) => {
      await connectToDatabase();
      await Upload.create({
        filename: file.name ?? file.key,
        url: file.url,
        size: file.size,
        mimetype: file.type ?? "image",
        key: file.key,
      });
      return { url: file.url };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
