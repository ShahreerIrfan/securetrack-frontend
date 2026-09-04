"use client";

import { FormEvent, useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";
import { formatUserName } from "@/lib/format";
import type { Comment } from "@/types/report";

export interface CommentThreadProps {
  reportId: number;
  comments: Comment[];
  currentUserId: number;
  isAdmin: boolean;
  onCommentAdded: (comment: Comment) => void;
  onCommentUpdated: (comment: Comment) => void;
  onCommentDeleted: (commentId: number) => void;
}

function CommentItem({
  reportId,
  comment,
  canModify,
  onUpdated,
  onDeleted,
}: {
  reportId: number;
  comment: Comment;
  canModify: boolean;
  onUpdated: (comment: Comment) => void;
  onDeleted: (commentId: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!content.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const { data } = await api.patch<Comment>(
        `/reports/${reportId}/comments/${comment.id}/`,
        { content },
      );
      onUpdated(data);
      setEditing(false);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this comment? This cannot be undone.")) return;
    setBusy(true);
    try {
      await api.delete(`/reports/${reportId}/comments/${comment.id}/`);
      onDeleted(comment.id);
    } catch (err) {
      setError(extractErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <li className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">
          {formatUserName(comment.author)}
        </span>
        <span className="text-xs text-muted">
          {new Date(comment.created_at).toLocaleString()}
          {comment.updated_at !== comment.created_at && " (edited)"}
        </span>
      </div>

      {editing ? (
        <div className="mt-2 space-y-2">
          <Textarea rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <Button className="px-2.5 py-1 text-xs" disabled={busy} onClick={handleSave}>
              Save
            </Button>
            <Button
              variant="outline"
              className="px-2.5 py-1 text-xs"
              disabled={busy}
              onClick={() => {
                setEditing(false);
                setContent(comment.content);
                setError(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-copy">{comment.content}</p>
          {canModify && (
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                className="text-xs text-accent hover:underline"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                type="button"
                className="text-xs text-danger hover:underline"
                disabled={busy}
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
          {error && (
            <p role="alert" className="mt-1 text-sm text-danger">
              {error}
            </p>
          )}
        </>
      )}
    </li>
  );
}

export function CommentThread({
  reportId,
  comments,
  currentUserId,
  isAdmin,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
}: CommentThreadProps) {
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
            <CommentItem
              key={comment.id}
              reportId={reportId}
              comment={comment}
              canModify={isAdmin || comment.author.id === currentUserId}
              onUpdated={onCommentUpdated}
              onDeleted={onCommentDeleted}
            />
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
