"use client";

import { FormEvent, useState } from "react";
import { MessagesSquare } from "lucide-react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { api } from "@/lib/api";
import { extractErrorMessage } from "@/lib/errors";
import { formatUserName } from "@/lib/format";
import { formatRelativeTime } from "@/lib/date";
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
  isMine,
  onUpdated,
  onDeleted,
}: {
  reportId: number;
  comment: Comment;
  canModify: boolean;
  isMine: boolean;
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
    <li className="flex gap-3">
      <Avatar user={comment.author} size="md" />

      <div className="min-w-0 flex-1">
        {/* Your own comments get an accent-tinted bubble so a thread
            reads as a conversation rather than a uniform list. */}
        <div
          className={
            isMine
              ? "rounded-xl rounded-tl-sm border border-accent/25 bg-accent/6 p-3.5"
              : "rounded-xl rounded-tl-sm border border-border bg-surface-raised/50 p-3.5"
          }
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-foreground">
              {formatUserName(comment.author)}
              {isMine && <span className="ml-1.5 text-xs font-normal text-muted">you</span>}
            </span>
            <span className="text-xs text-muted">
              {formatRelativeTime(comment.created_at)}
              {comment.updated_at !== comment.created_at && " · edited"}
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
                <Button className="px-3 py-1 text-xs" disabled={busy} onClick={handleSave}>
                  Save
                </Button>
                <Button
                  variant="ghost"
                  className="px-3 py-1 text-xs"
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
            <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-copy">
              {comment.content}
            </p>
          )}
        </div>

        {canModify && !editing && (
          <div className="mt-1.5 flex gap-3 pl-1">
            <button
              type="button"
              className="text-xs text-muted transition-colors hover:text-accent"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button
              type="button"
              className="text-xs text-muted transition-colors hover:text-danger"
              disabled={busy}
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}

        {error && !editing && (
          <p role="alert" className="mt-1 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
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
    <div className="space-y-5">
      {comments.length === 0 ? (
        <EmptyState
          icon={<MessagesSquare size={28} />}
          title="No comments yet"
          description="Start the discussion — ask for repro steps, or share what you found."
        />
      ) : (
        <ul className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              reportId={reportId}
              comment={comment}
              isMine={comment.author.id === currentUserId}
              canModify={isAdmin || comment.author.id === currentUserId}
              onUpdated={onCommentUpdated}
              onDeleted={onCommentDeleted}
            />
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 border-t border-border/60 pt-5">
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
