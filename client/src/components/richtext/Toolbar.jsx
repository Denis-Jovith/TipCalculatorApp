import { useRef } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Video as VideoIcon,
  Undo2,
  Redo2,
  Heading2,
  Heading3
} from 'lucide-react';
import { api } from '../../api/client';
import toast from 'react-hot-toast';

function ToolbarButton({ active, onClick, title, children, disabled }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`p-2 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? 'bg-brand-teal text-[#08122c]' : 'text-slate-300 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}

export default function Toolbar({ editor }) {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  if (!editor) return null;

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.url;
  };

  const handleImagePick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const toastId = toast.loading('Uploading image…');
    try {
      const url = await uploadFile(file);
      editor.chain().focus().setImage({ src: url, align: 'center' }).run();
      toast.success('Image inserted', { id: toastId });
    } catch {
      toast.error('Image upload failed', { id: toastId });
    }
  };

  const handleVideoPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const toastId = toast.loading('Uploading video…');
    try {
      const url = await uploadFile(file);
      editor.chain().focus().setVideo({ src: url, align: 'center' }).run();
      toast.success('Video inserted', { id: toastId });
    } catch {
      toast.error('Video upload failed', { id: toastId });
    }
  };

  const promptYoutube = () => {
    const url = window.prompt('Paste a YouTube video URL');
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const setLink = () => {
    const previous = editor.getAttributes('link').href;
    const url = window.prompt('Link URL', previous || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const setImageAlign = (align) => {
    if (editor.isActive('image')) editor.chain().focus().updateAttributes('image', { align }).run();
    if (editor.isActive('video')) editor.chain().focus().updateAttributes('video', { align }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-white/5 rounded-t-lg">
      <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={16} />
      </ToolbarButton>

      <span className="w-px h-5 bg-white/10 mx-1" />

      <ToolbarButton
        title="Heading 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={16} />
      </ToolbarButton>

      <span className="w-px h-5 bg-white/10 mx-1" />

      <ToolbarButton
        title="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Numbered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Quote"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </ToolbarButton>

      <span className="w-px h-5 bg-white/10 mx-1" />

      <ToolbarButton title="Align left" onClick={() => setImageAlign('left')}>
        <AlignLeft size={16} />
      </ToolbarButton>
      <ToolbarButton title="Align center" onClick={() => setImageAlign('center')}>
        <AlignCenter size={16} />
      </ToolbarButton>
      <ToolbarButton title="Align right" onClick={() => setImageAlign('right')}>
        <AlignRight size={16} />
      </ToolbarButton>

      <span className="w-px h-5 bg-white/10 mx-1" />

      <ToolbarButton title="Link" active={editor.isActive('link')} onClick={setLink}>
        <LinkIcon size={16} />
      </ToolbarButton>
      <ToolbarButton title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}>
        <Unlink size={16} />
      </ToolbarButton>

      <span className="w-px h-5 bg-white/10 mx-1" />

      <ToolbarButton title="Insert image" onClick={() => imageInputRef.current?.click()}>
        <ImageIcon size={16} />
      </ToolbarButton>
      <ToolbarButton title="Insert video file" onClick={() => videoInputRef.current?.click()}>
        <VideoIcon size={16} />
      </ToolbarButton>
      <ToolbarButton title="Embed YouTube video" onClick={promptYoutube}>
        <span className="text-[10px] font-bold px-0.5">YT</span>
      </ToolbarButton>

      <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={handleImagePick} />
      <input ref={videoInputRef} type="file" accept="video/*" hidden onChange={handleVideoPick} />

      <span className="w-px h-5 bg-white/10 mx-1" />

      <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo2 size={16} />
      </ToolbarButton>
      <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo2 size={16} />
      </ToolbarButton>
    </div>
  );
}
