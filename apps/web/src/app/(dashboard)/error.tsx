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
      <h2 className="text-lg font-semibold text-wing-900 mb-2">Något gick fel</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Ett oväntat fel uppstod. Försök igen eller ladda om sidan.
      </p>
      <button
        onClick={reset}
        className="bg-wing-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-wing-700 transition-colors"
      >
        Försök igen
      </button>
    </div>
  );
}
