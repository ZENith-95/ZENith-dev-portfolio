import mongoose, { Schema, type Model } from "mongoose";

export interface UploadDocument extends mongoose.Document {
  filename: string;
  url: string;
  size: number;
  mimetype: string;
  key?: string;
  createdAt: Date;
}

const UploadSchema = new Schema<UploadDocument>(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
    key: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Upload: Model<UploadDocument> =
  mongoose.models.Upload || mongoose.model<UploadDocument>("Upload", UploadSchema);
