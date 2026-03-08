"use client";

import { useEffect, useState } from "react";

type EchoData = {
  inspirationId: string;
  originalText: string;
  echoText: string;
};

export default function EchoCard() {
  const [echo, setEcho] = useState<EchoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadEcho() {
    try {
      const res = await fetch("/api/echo", {
        method: "GET",
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok) {
        console.error(result);
        setEcho(null);
        return;
      }

      setEcho(result.echo);
    } catch (error) {
      console.error(error);
      setEcho(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadEcho();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await loadEcho();
  }

  function handleContinue() {
    if (!echo) return;

    const params = new URLSearchParams({
      inspirationId: echo.inspirationId,
      text: echo.echoText,
    });

    window.location.href = `/draft?${params.toString()}`;
  }

  if (loading) {
    return (
      <section className="mb-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-3 text-xs uppercase tracking-wide text-neutral-400">
          Echo
        </div>
        <h2 className="text-2xl font-semibold text-neutral-900">
          你昨天其实已经很接近表达了
        </h2>
        <p className="mt-4 text-neutral-500">正在为你找回一条差点说出口的话…</p>
      </section>
    );
  }

  if (!echo) {
    return null;
  }

  return (
    <section className="mb-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-3 text-xs uppercase tracking-wide text-neutral-400">
        Echo
      </div>

      <h2 className="text-2xl font-semibold text-neutral-900">
        你昨天其实已经很接近表达了
      </h2>

      <div className="mt-5 rounded-2xl bg-neutral-50 p-4">
        <div className="mb-2 text-xs uppercase tracking-wide text-neutral-400">
          你当时写下的是
        </div>
        <p className="text-neutral-700">「{echo.originalText}」</p>
      </div>

      <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
        <div className="mb-2 text-xs uppercase tracking-wide text-neutral-400">
          我帮你写了一段开头
        </div>
        <p className="leading-7 text-neutral-800">{echo.echoText}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={handleContinue}
          className="rounded-xl bg-black px-4 py-2 text-sm text-white transition hover:opacity-90"
        >
          继续写
        </button>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
        >
          {refreshing ? "正在换一条…" : "换一个灵感"}
        </button>
      </div>
    </section>
  );
}