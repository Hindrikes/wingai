"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <div className="text-4xl mb-4">⚠️</div>
      <h2 className="font-serif text-lg font-semibold text-ink-900 mb-2">Något gick fel</h2>
      <p className="text-sm text-sand-700 mb-6 max-w-sm">
        Ett oväntat fel uppstod. Försök igen eller ladda om sidan.
      </p>
      <button
        onClick={reset}
        className="bg-ink-900 text-sand-100 px-5 py-2 rounded text-sm font-medium hover:bg-ink-800 transition-colors"
      >
        Försök igen
      </button>
    </div>
  );
}
