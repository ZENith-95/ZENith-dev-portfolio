import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { Post } from "@/models/Post";
import { Tag } from "@/models/Tag";
import { PostEditor } from "@/components/admin/PostEditor";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  await connectToDatabase();
  const post = await Post.findById(params.id).lean();
  if (!post) {
    notFound();
  }

  const tagDocs = await Tag.find({ slug: { $in: post.tags ?? [] } }).lean();
  const tagNames = tagDocs.length ? tagDocs.map((tag) => tag.name) : post.tags ?? [];

  return (
    <PostEditor
      mode="edit"
      initialData={{
        _id: post._id.toString(),
        title: post.title,
        summary: post.summary,
        content: post.content,
        coverImage: post.coverImage ?? undefined,
        tags: tagNames,
        status: post.status,
        featured: post.featured ?? false,
      }}
    />
  );
}

