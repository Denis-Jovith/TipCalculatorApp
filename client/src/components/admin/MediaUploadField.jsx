import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Upload, X } from 'lucide-react';
import { api } from '../../api/client';

export default function MediaUploadField({ label, value, onChange, accept = 'image/*', kind = 'image' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handlePick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onChange(data.url);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/… or paste a URL"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 text-slate-200 text-xs hover:bg-white/20 disabled:opacity-60 shrink-0"
        >
          <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 text-slate-400 hover:text-red-400 shrink-0"
            aria-label="Clear"
          >
            <X size={14} />
          </button>
        )}
        <input ref={inputRef} type="file" accept={accept} hidden onChange={handlePick} />
      </div>
      {value && kind === 'image' && (
        <img src={value} alt="preview" className="mt-2 h-20 rounded-lg object-cover border border-white/10" />
      )}
      {value && kind === 'video' && (
        <video src={value} className="mt-2 h-24 rounded-lg border border-white/10" controls muted />
      )}
    </div>
  );
}
