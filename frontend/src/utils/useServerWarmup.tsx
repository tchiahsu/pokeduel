import { useEffect, useState } from "react";

const API_URL_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export function useServerWarmup(opts?: { retries?: number; initialDelayMs?: number }) {
  const [ready, setReady] = useState(false);

  const retries = opts?.retries ?? 6;             // how many times to retry
  const initialDelay = opts?.initialDelayMs ?? 500; // starting delay in ms

  useEffect(() => {
    let cancelled = false;

    const ping = async (n: number) => {
      try {
        const ctrl = new AbortController();
        const timeoutId = setTimeout(() => ctrl.abort(), 4000); // 4s timeout
        const res = await fetch(`${API_URL_BASE}/health`, { signal: ctrl.signal });
        clearTimeout(timeoutId);

        if (!cancelled && res.ok) {
          setReady(true);
          return;
        }
      } catch {
        // ignore errors; will retry
      }

      if (!cancelled && n < retries) {
        const delay = initialDelay * Math.pow(2, n); // exponential backoff
        setTimeout(() => ping(n + 1), delay);
      }
    };

    ping(0);
    return () => {
      cancelled = true;
    };
  }, [retries, initialDelay]);

  return ready;
}