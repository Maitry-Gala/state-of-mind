import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { useOnClickOutside } from "usehooks-ts";
import api from "../../libs/axios";
import { useContent, type ContentType } from "../../context/ContentContext";
import { CloseIcon } from "../icons/CloseIcon";

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "video",   label: "Video (YouTube)" },
  { value: "article", label: "Article / Tweet" },
  { value: "image",   label: "Image" },
  { value: "audio",   label: "Audio" },
];

export function CreateContentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState<ContentType>("article");
  const [submitting, setSubmitting] = useState(false);
  const { addCard } = useContent();

  useOnClickOutside(ref as React.RefObject<HTMLElement>, open ? onClose : () => {});

  async function handleSubmit() {
    if (!title.trim() || !link.trim()) {
      toast.error("Title and link are required");
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.post("/user/content", { title, link, type, tags: [] });
      // optimistically add — if backend returns the doc use it, else refetch
      if (res.data.content) {
        addCard(res.data.content);
      }
      toast.success("Content added");
      setTitle(""); setLink(""); setType("article");
      onClose();
    } catch {
      toast.error("Failed to add content");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div ref={ref} className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Add Content</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Interesting article on AI"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">Link</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://"
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ContentType)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all bg-white"
            >
              {CONTENT_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {submitting ? "Adding..." : "Add"}
          </button>
        </div>

      </div>
    </div>
  );
}