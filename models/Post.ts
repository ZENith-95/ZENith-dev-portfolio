import mongoose, { Schema, type Model } from "mongoose";

export type PostStatus = "draft" | "published";

export interface PostDocument extends mongoose.Document {
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: PostStatus;
  featured: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<PostDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    tags: [{ type: String }],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export const Post: Model<PostDocument> =
  mongoose.models.Post || mongoose.model<PostDocument>("Post", PostSchema);
