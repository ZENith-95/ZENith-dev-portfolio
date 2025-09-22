"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type PostEditorMode = "create" | "edit";

type InitialData = {
  _id?: string;
  title: string;
  summary: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: "draft" | "published";
  featured: boolean;
};

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "blockquote", "code-block", "clean"],
  ],
};

interface PostEditorProps {
  mode: PostEditorMode;
  initialData?: InitialData;
}

export function PostEditor({ mode, initialData }: PostEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [summary, setSummary] = useState(initialData?.summary ?? "");
  const [content, setContent] = useState(initialData?.content ?? "<p>Start writing your story...</p>");
  const [coverImage, setCoverImage] = useState<string | null>(initialData?.coverImage ?? null);
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published">(initialData?.status ?? "draft");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tags")
      .then((res) => res.json())
      .then((res) => setAvailableTags(res.data?.map((tag: any) => tag.name) ?? []))
      .catch(() => setAvailableTags([]));
  }, []);

  const suggestions = useMemo(() => {
    if (!tagsInput) return [];
    return availableTags.filter(
      (tag) => tag.toLowerCase().includes(tagsInput.toLowerCase()) && !tags.includes(tag)
    );
  }, [availableTags, tags, tagsInput]);

  const handleAddTag = (value?: string) => {
    const tag = (value ?? tagsInput).trim();
    if (!tag) return;
    setTags((prev) => Array.from(new Set([...prev, tag])));
    setTagsInput("");
  };

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/uploads", { method: "POST", body: formData });
    if (res.ok) {
      const json = await res.json();
      setCoverImage(json.data.url);
    }
  };

  const savePost = async (publish = false) => {
    setLoading(true);
    setMessage(null);
    const payload = {
      title,
      summary,
      content,
      coverImage: coverImage ?? undefined,
      tags,
      status: publish ? "published" : status,
      featured,
    };

    const endpoint = mode === "create" ? "/api/posts" : `/api/posts/${initialData?._id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      setMessage("Saved successfully");
      const targetId = mode === "create" ? json.data._id : initialData?._id;
      setTimeout(() => {
        router.push(`/admin/posts/${targetId}/edit`);
      }, 600);
    } else {
      const json = await res.json().catch(() => ({ error: "Something went wrong" }));
      setMessage(typeof json.error === "string" ? json.error : "Could not save the post");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {mode === "create" ? "Create new post" : "Edit post"}
          </h1>
          <p className="text-sm text-white/60">
            {mode === "create"
              ? "Craft something brilliant and share it with the world."
              : "Update your story and keep your audience engaged."}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => savePost(false)}
            disabled={loading}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-purple-400 hover:text-white disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            onClick={() => savePost(true)}
            disabled={loading}
            className="rounded-full border border-purple-500/40 bg-purple-500/30 px-4 py-2 text-sm text-purple-100 transition hover:bg-purple-500/40 disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </div>

      {message && <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">{message}</p>}

      <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-white/60" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
              placeholder="Designing immersive experiences"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/60" htmlFor="summary">
              Summary
            </label>
            <input
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
              placeholder="A quick teaser for the post"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/60">Cover image</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="w-full rounded-2xl border border-dashed border-white/20 bg-black/40 px-4 py-6 text-sm text-white/60"
            />
            {coverImage && (
              <div
                className="h-24 w-32 overflow-hidden rounded-2xl border border-white/10 bg-cover bg-center"
                style={{ backgroundImage: `url(${coverImage})` }}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/60">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setTags(tags.filter((t) => t !== tag))}
                className="rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-xs text-purple-100"
              >
                {tag}
                <span className="ml-2 text-white/50">×</span>
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
              placeholder="Add tag and press enter"
            />
            {suggestions.length > 0 && (
              <div className="absolute mt-2 w-full rounded-2xl border border-white/10 bg-black/80 p-2 text-sm text-white">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleAddTag(suggestion)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-white/10"
                  >
                    {suggestion}
                    <span className="text-xs text-white/40">Add</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/70">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4"
            />
            Feature this post on the homepage
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Publish immediately</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} className="h-[400px] text-white" />
      </div>
    </div>
  );
}

