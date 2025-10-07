"use client";

import { useState } from "react";

interface UploadItem {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimetype: string;
  createdAt: string;
}

interface UploadsManagerProps {
  initialUploads: UploadItem[];
}

export function UploadsManager({ initialUploads }: UploadsManagerProps) {
  const [uploads, setUploads] = useState(initialUploads);
  const [message, setMessage] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/uploads/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUploads((prev) => prev.filter((upload) => upload.id !== id));
      setMessage("Asset removed");
    }
  };

  const handleCopy = async (url: string) => {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    await navigator.clipboard.writeText(fullUrl);
    setMessage("Link copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Assets</h1>
          <p className="text-sm text-white/60">Manage uploaded imagery and content assets.</p>
        </div>
      </div>
      {message && <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">{message}</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {uploads.map((upload) => (
          <div key={upload.id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <div
              className="h-40 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${upload.url})` }}
            />
            <div className="space-y-3 p-4 text-sm text-white/70">
              <div>
                <p className="text-white">{upload.filename}</p>
                <p className="text-xs text-white/50">{(upload.size / 1024).toFixed(1)} KB � {upload.mimetype}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(upload.url)}
                  className="flex-1 rounded-full border border-white/10 px-3 py-2 text-xs text-white/70 transition hover:border-purple-400 hover:text-white"
                >
                  Copy link
                </button>
                <button
                  onClick={() => handleDelete(upload.id)}
                  className="rounded-full border border-red-500/30 px-3 py-2 text-xs text-red-200 transition hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {uploads.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-white/10 bg-white/5 px-6 py-16 text-center text-sm text-white/60">
            No assets uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}
