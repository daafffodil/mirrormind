"use client";

import { useState } from "react";

export default function CaptureBox() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!text.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/generate-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const result = await res.json();
      console.log(result);

      if (!res.ok) {
        alert("生成失败，请打开控制台看报错");
        return;
      }

      setText("");
      location.reload();
    } catch (err) {
      console.error(err);
      alert("请求失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your inspiration..."
        className="w-full resize-none rounded-lg border border-neutral-200 p-3 text-sm"
        rows={4}
      />

      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-3 rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Save with AI"}
      </button>
    </div>
  );
}