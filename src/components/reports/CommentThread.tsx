"use client";

import { FormEvent, useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";
import type { Comment } from "@/types/report";

export interface CommentThreadProps {
  reportId: number;
  comments: Comment[];
  onCommentAdded: (comment: Comment) => void;
}

export function CommentThread({ reportId, comments, onCommentAdded }: CommentThreadProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      const { data } = await api.post<Comment>(`/reports/${reportId}/comments/`, { content });
      onCommentAdded(data);
      setContent("");
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {comments.length === 0 ? (
        <EmptyState title="No comments yet" description="Be the first to comment." />
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {comment.author.username}
                </span>
                <span className="text-xs text-muted">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-sm text-copy">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          rows={3}
          placeholder="Add a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <Button type="submit" disabled={submitting || !content.trim()}>
          {submitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>
    </div>
  );
}
