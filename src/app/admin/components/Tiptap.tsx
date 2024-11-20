"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Tiptap({
  description,
  onChange,
}: {
  description: string;
  onChange: (description: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit.configure()],
    content: description,
    editorProps: {
      attributes: {
        class: "rounded-md border min-h-[200px] border-input",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="flex min-h-[250px] flex-col justify-stretch">
      <EditorContent editor={editor} />
    </div>
  );
}
