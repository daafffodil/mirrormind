"use client";

import { useEffect, useRef, useState } from "react";

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
        }
      } catch {
        // ignore counter fetch failures to avoid blocking page rendering
      }
    };

    void fetchCount();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        left: "10px",
        padding: "5px 10px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        borderRadius: "5px",
        fontSize: "14px",
        zIndex: 1000,
      }}
    >
      访问计数: {count}
    </div>
  );
}
