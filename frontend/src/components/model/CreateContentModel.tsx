import React, { useRef , useState} from "react";
import { toast } from "sonner";
import { useOnClickOutside } from "usehooks-ts";
import api from "../../libs/axios";
const CONTENT_TYPES = ["image", "video", "article", "audio"] as const;
type ContentType = (typeof CONTENT_TYPES)[number];
import { Button } from "../ui/Button";
import { CloseIcon } from "../icons/CloseIcon";
import { Input } from "../ui/Input";

export function CreateContentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState<ContentType>("article");
  const [submitting, setSubmitting] = useState(false);

  useOnClickOutside(ref as React.RefObject<HTMLElement>, open ? onClose: () => {});

  async function handleSubmit() {
    if(!title || !link) {
        toast.error("Tiitle and link are required");
        return;
    }
    try{
        setSubmitting(true);
        await api.post("user/content", {title,link,type, tags: []});
        toast.success("Content added");
        setTitle("");
        setLink("");
        setType("article");
        onClose();
    }catch (e) {
        toast.error("Failed to add content");
    } finally {
        setSubmitting(false);
    }
  }

  if (!open) return null;
  return (
    <div className="w-screen h-screen bg-slate-500/60 fixed top-0 left-0 flex justify-center items-center z-50">
      <div ref={ref} className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <div className="flex justify-end">
          <button aria-label="Close" className="hover:text-gray-600 transition-colors cursor-pointer" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ContentType)}
            className="w-full px-3 py-2.5 text-sm rounded-md border border-gray-200 outline-none focus:ring-2 focus:ring-purple-300"
          >
            {CONTENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Button variant="primary" text={submitting ? "Adding..." : "Submit"} onClick={handleSubmit} disabled={submitting} />
      </div>
    </div>
  );
}
