import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { buttonClassName } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <FileQuestion size={48} className="text-muted" />
      <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
      <p className="max-w-sm text-sm text-copy">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Link href="/" className={buttonClassName("primary")}>
        Back to Home
      </Link>
    </div>
  );
}
