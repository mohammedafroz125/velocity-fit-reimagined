"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LeadNote } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, Clock, User } from "lucide-react";

export function LeadNotesManager({
  leadId,
  notes,
}: {
  leadId: string;
  notes: LeadNote[];
}) {
  const router = useRouter();
  const [noteBody, setNoteBody] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteBody.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteBody }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add note");
      }

      setNoteBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving note");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-paper border border-ink/10 space-y-5 shadow-subtle">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display font-medium text-ink flex items-center space-x-2">
          <MessageSquarePlus className="w-4 h-4 text-olive-deep" />
          <span>Internal Practice Notes</span>
        </h3>
        <span className="text-xs font-mono text-ink-soft">
          {notes.length} note{notes.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Note Input Box */}
      <form onSubmit={handleAddNote} className="space-y-3">
        <textarea
          rows={3}
          placeholder="Log clinical notes, call summary, consultation scheduling notes..."
          value={noteBody}
          onChange={(e) => setNoteBody(e.target.value)}
          className="w-full p-3.5 rounded-xl bg-ivory border border-ink/15 text-xs text-ink placeholder:text-ink/40 focus:outline-none focus:border-olive-deep focus:ring-1 focus:ring-olive-deep resize-none shadow-sm"
        />
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !noteBody.trim()}
            className="bg-ink text-paper hover:bg-ink-soft font-semibold rounded-full text-xs h-9 px-5 shadow-subtle cursor-pointer"
          >
            {isSubmitting ? "Saving Note..." : "Add Note"}
          </Button>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-3 pt-2">
        {notes.length === 0 ? (
          <p className="text-xs text-ink-soft italic text-center py-4">
            No notes logged for this prospect yet.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-xl bg-ivory border border-ink/10 space-y-2 text-xs shadow-sm"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-ink flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-olive-deep" />
                  <span>{note.authorName}</span>
                </span>
                <span className="flex items-center space-x-1 font-mono text-ink-soft">
                  <Clock className="w-3 h-3 text-ink-soft/70" />
                  <span>
                    {new Date(note.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </span>
              </div>
              <p className="text-ink-soft leading-relaxed whitespace-pre-wrap pl-5">
                {note.noteBody}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
