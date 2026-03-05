"use client";

import { useEffect } from "react";

const RELOAD_KEY = "quran-chunk-reload";

function shouldReloadForChunkError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("chunkloaderror") ||
    (normalized.includes("loading chunk") && normalized.includes("failed")) ||
    (normalized.includes("/_next/static/chunks/") && normalized.includes("404"))
  );
}

export function ChunkErrorHandler() {
  useEffect(() => {
    const reloadOnce = () => {
      if (sessionStorage.getItem(RELOAD_KEY) === "1") {
        sessionStorage.removeItem(RELOAD_KEY);
        return;
      }

      sessionStorage.setItem(RELOAD_KEY, "1");
      window.location.reload();
    };

    const handleError = (event: ErrorEvent) => {
      const message =
        event.message ||
        (typeof event.error?.message === "string" ? event.error.message : "");

      if (shouldReloadForChunkError(message)) {
        reloadOnce();
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === "string"
          ? reason
          : typeof reason?.message === "string"
          ? reason.message
          : "";

      if (shouldReloadForChunkError(message)) {
        reloadOnce();
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
