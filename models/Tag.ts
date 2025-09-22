import mongoose, { Schema, type Model } from "mongoose";

export interface TagDocument extends mongoose.Document {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<TagDocument>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Tag: Model<TagDocument> =
  mongoose.models.Tag || mongoose.model<TagDocument>("Tag", TagSchema);
