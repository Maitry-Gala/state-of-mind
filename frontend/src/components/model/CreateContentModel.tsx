import { useRef, useState, type HTMLInputAutoCompleteAttribute } from "react";
import { CloseIcon } from "../icons/CloseIcon";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useOnClickOutside } from "usehooks-ts";
import { contentSchema, type ContentFormData } from "../../../../backend/src/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export function CreateContentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  // const [title, setTitle] = useState("");
  // const [type, setType] = useState("");

  const handleClickOutside = () => { onClose(); };

  useOnClickOutside(ref as React.RefObject<HTMLElement>, open ? handleClickOutside : () => {});

  if (!open) return null;

  return (
    <div className="w-screen h-screen bg-slate-500/60 fixed top-0 left-0 flex justify-center items-center">
      <div ref={ref} className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <div className="flex justify-end">
          <button
            aria-label="Close"
            className="hover:text-gray-600 transition-colors cursor-pointer"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <Input placeholder="Title" onChange={() => {}} />
          <Input placeholder="Type" onChange={ () => {}} />
        </div>
        <Button variant="primary" text="Submit" />
      </div>
    </div>
  );
}

// import { useRef, useState, KeyboardEvent } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useOnClickOutside } from "usehooks-ts";
// import { CloseIcon } from "../icons/CloseIcon";
// import { Button } from "../ui/Button";
// import { contentSchema, contentType, type ContentFormData } from "../../lib/schema/content.schema";

// interface CreateContentModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: ContentFormData) => Promise<void>
// }

// export function CreateContentModal ({open,onClose, onSubmit }: CreateContentModalProps) {
//   const ref = useRef<HTMLDivElement>(null);
//   const [tagInput,setTagInput] = useState("");
//   const [tags, setTags] = useState<string[]>([]);

//   const {
//     register,handleSubmit,setValue,reset,formState : { errors, isSubmitting }, 
//     } = useForm<ContentFormData> ({ resolver: zodResolver(contentSchema),defaultValues: {tags: []},
//   });

//   useOnClickOutside(ref as React.RefObject<HTMLElement>,open ? handleClose : () => {});

//   function handleClose() {
//     reset();
//     setTags([]);
//     setTagInput("");
//     onClose();
//   }

//   async function handleFormSubmit(data: ContentFormData) {
//     await onSubmit({ ...data, tags});
//     handleClose();
//   }

//   function addTag(e: KeyboardEvent<HTMLInputElement>){
//     if(e.key !== "Enter") return;
//     e.preventDefault();
//     const trimmed = tagInput.trim().toLowerCase();
//     if(!trimmed || tags.includes(trimmed)) return;
//     const updated = [...tags, trimmed];
//     setTags("tags", updated);
//     setTagInput("");
//   }

//   function removeTag(tag: string) {
//     const updated = tags.filter((t) => t !== tag);
//     setTags(updated);
//     setValue("tags")

//   }


//   }
// }