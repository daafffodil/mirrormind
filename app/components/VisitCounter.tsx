"use client";

import { useEffect, useRef, useState } from "react";

const VISIT_COUNTER_KEY = "visitCounter:lastCount";

type VisitCounterResponse = {
  count?: number;
};

function getOptimisticCount(): number | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(VISIT_COUNTER_KEY);
  const lastCount = raw ? Number(raw) : NaN;

  return Number.isFinite(lastCount) ? lastCount + 1 : null;
}

export default function VisitCounter() {
  const [count, setCount] = useState<number | null>(() => getOptimisticCount());
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchCount = async () => {
      try {
        const res = await fetch("/api/visit-counter", { cache: "no-store" });
        if (!res.ok) return;

        const data = (await res.json()) as VisitCounterResponse;
        if (typeof data.count !== "number") return;

        setCount(data.count);
        window.localStorage.setItem(VISIT_COUNTER_KEY, String(data.count));
      } catch {
        // ignore counter fetch failures to avoid blocking page rendering
      }
    };

    void fetchCount();
  }, []);

  return <p className="mb-2 text-xs text-neutral-400">访问计数: {count ?? "--"}</p>;
}
