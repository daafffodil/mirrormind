"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

type Inspiration = {
  id: string;
  created_at: string;
  input_type: string;
  raw_text: string | null;
  image_url: string | null;
  ai_title: string | null;
  ai_summary: string | null;
  ai_product_idea?: string | null;
  ai_xiaohongshu_title?: string | null;
  ai_next_action?: string | null;
  ai_interest_tags?: string[] | null;
  status: string | null;
};

export default function InspirationCard({
  item,
}: {
  item: Inspiration;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
  const ok = window.confirm("确定删除这张灵感卡片吗？");
  if (!ok) return;

  setDeleting(true);

  try {
    const res = await fetch(`/api/delete-inspiration?id=${item.id}`, {
      method: "DELETE",
    });

    const raw = await res.text();
    let result: unknown = null;

    try {
      result = raw ? JSON.parse(raw) : null;
    } catch {
      result = raw;
    }

    if (!res.ok) {
      console.error("delete failed:", result);
      alert("删除失败");
      return;
    }

    window.location.reload();
  } catch (error) {
    console.error(error);
    alert("删除请求失败");
  } finally {
    setDeleting(false);
  }
}

  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-neutral-400">
          <span>{item.status ?? "ready"}</span>
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-md p-1.5 text-neutral-300 transition hover:bg-neutral-100 hover:text-neutral-500 disabled:opacity-40"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <h2 className="mb-2 text-xl font-medium text-neutral-900">
        {item.ai_title || "Untitled inspiration"}
      </h2>

      <p className="mb-4 text-neutral-700">
        {item.ai_summary || "No summary yet."}
      </p>

      {item.ai_interest_tags && item.ai_interest_tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {item.ai_interest_tags.map((tag) => (
            <span
              key={`${item.id}-${tag}`}
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {item.ai_product_idea && (
        <div className="mb-3 rounded-xl bg-neutral-50 p-3">
          <div className="mb-1 text-xs uppercase tracking-wide text-neutral-400">
            Product Idea
          </div>
          <p className="text-sm text-neutral-700">{item.ai_product_idea}</p>
        </div>
      )}

      {item.ai_xiaohongshu_title && (
        <div className="mb-3 rounded-xl bg-neutral-50 p-3">
          <div className="mb-1 text-xs uppercase tracking-wide text-neutral-400">
            Xiaohongshu Title
          </div>
          <p className="text-sm text-neutral-700">
            {item.ai_xiaohongshu_title}
          </p>
        </div>
      )}

      {item.ai_next_action && (
        <div className="mb-3 rounded-xl bg-neutral-50 p-3">
          <div className="mb-1 text-xs uppercase tracking-wide text-neutral-400">
            Next Action
          </div>
          <p className="text-sm text-neutral-700">{item.ai_next_action}</p>
        </div>
      )}

      {item.raw_text && (
        <div className="rounded-xl bg-neutral-50 p-3 text-sm text-neutral-500">
          {item.raw_text}
        </div>
      )}
    </article>
  );
}
