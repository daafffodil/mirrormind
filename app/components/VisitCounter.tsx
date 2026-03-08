"use client";

import { useEffect, useRef, useState } from "react";

const VISIT_COUNTER_KEY = "visitCounter:lastCount";

function getOptimisticCount() {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(VISIT_COUNTER_KEY);
  const lastCount = raw ? Number(raw) : NaN;

  if (Number.isFinite(lastCount)) {
    return lastCount + 1;
  }

  return null;
}

export default function VisitCounter() {
  const [count, setCount] = useState<number | null>(() => getOptimisticCount());
export default function VisitCounter() {
  const [count, setCount] = useState<number>(0);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;


    const fetchCount = async () => {
      try {
        const res = await fetch("/api/visit-counter", { cache: "no-store" });
        if (!res.ok) return;

        const data = (await res.json()) as { count?: number };
        if (typeof data.count === "number") {
          setCount(data.count);
          window.localStorage.setItem(VISIT_COUNTER_KEY, String(data.count));
        }
      } catch {
        // ignore counter fetch failures to avoid blocking page rendering
      }
    };

    void fetchCount();
  }, []);

  return (
    <p className="mb-2 text-xs text-neutral-400">
      访问计数: {count ?? "--"}
    </p>
  );
}
