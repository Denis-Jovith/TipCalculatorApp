import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import { useEffect } from 'react';
import { ImageWithAlign } from './imageWithAlign.js';
import { Video } from './VideoExtension.js';
import Toolbar from './Toolbar.jsx';

export default function RichTextEditor({ value, onChange, placeholder = 'Start writing…' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      ImageWithAlign,
      Video,
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
      Placeholder.configure({ placeholder })
    ],
    content: value || '',
    onUpdate: ({ editor: e }) => onChange(e.getHTML())
  });

  // Keep the editor in sync if the parent resets `value` (e.g. switching records)
  useEffect(() => {
    if (editor && value !== editor.getHTML() && document.activeElement?.closest('.ProseMirror') === null) {
      editor.commands.setContent(value || '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="prose-portfolio px-4 py-3 min-h-[180px] max-h-[420px] overflow-y-auto focus:outline-none" />
    </div>
  );
}
