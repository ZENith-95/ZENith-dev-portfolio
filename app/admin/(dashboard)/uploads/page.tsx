import { connectToDatabase } from "@/lib/db";
import { Upload } from "@/models/Upload";
import { UploadsManager } from "@/components/admin/UploadsManager";

export default async function UploadsPage() {
  await connectToDatabase();
  const uploads = await Upload.find().sort({ createdAt: -1 }).lean();

  return <UploadsManager initialUploads={uploads.map((upload) => ({
    id: upload._id.toString(),
    filename: upload.filename,
    url: upload.url,
    size: upload.size,
    mimetype: upload.mimetype,
    createdAt: upload.createdAt,
  }))} />;
}

