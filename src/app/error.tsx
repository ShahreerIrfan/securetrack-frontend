"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <AlertTriangle size={48} className="text-danger" />
      <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
      <p className="max-w-sm text-sm text-copy">
        An unexpected error occurred. You can try again, or head back to the homepage.
      </p>
      <Button onClick={retry}>Try Again</Button>
    </div>
  );
}
