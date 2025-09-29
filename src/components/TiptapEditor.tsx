"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react'; // <-- 1. Import tipe 'Editor'
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react';
import './Tiptap.css';

interface TiptapProps {
  content: string;
  onChange: (richText: string) => void;
}

// 2. Terapkan tipe 'Editor' pada properti 'editor'
const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-t-lg p-2 flex items-center flex-wrap gap-2">
      <button type-="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
        <Bold className="w-5 h-5"/>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
        <Italic className="w-5 h-5"/>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
        <Heading2 className="w-5 h-5"/>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>
        <List className="w-5 h-5"/>
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>
        <ListOrdered className="w-5 h-5"/>
      </button>
    </div>
  );
};

export default function TiptapEditor({ content, onChange }: TiptapProps) {
    const editor = useEditor({
      extensions: [
        StarterKit.configure(),
      ],
      content: content,
      editorProps: {
        attributes: {
          class: 'prose max-w-none p-4 focus:outline-none',
        },
      },
      // TAMBAHKAN BARIS INI
      immediatelyRender: false,
      
      onUpdate({ editor }) {
        onChange(editor.getHTML());
      },
    });

  return (
    <div className="border border-gray-300 rounded-lg">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} style={{minHeight: '150px'}} />
    </div>
  );
}