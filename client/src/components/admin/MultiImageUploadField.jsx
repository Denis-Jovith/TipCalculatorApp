import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Upload, X, GripVertical } from 'lucide-react';
import { api } from '../../api/client';

// Like MediaUploadField, but for an ordered list of images (e.g. a profile or
// achievement carousel) instead of a single URL.
export default function MultiImageUploadField({ label, values = [], onChange }) {
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
      onChange([...values, data.url]);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const remove = (index) => onChange(values.filter((_, i) => i !== index));
  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{label}</label>
      <div className="flex flex-wrap gap-3 mb-2">
        {values.map((url, i) => (
          <div key={url + i} className="relative group">
            <img src={url} alt={`Image ${i + 1}`} className="w-20 h-20 rounded-lg object-cover border border-white/10" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="p-1 text-white disabled:opacity-30"
                title="Move earlier"
              >
                <GripVertical size={14} className="rotate-90" />
              </button>
              <button type="button" onClick={() => remove(i)} className="p-1 text-red-400" title="Remove">
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-20 h-20 flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/20 text-slate-400 hover:bg-white/5 disabled:opacity-60"
        >
          <Upload size={16} />
          <span className="text-[10px]">{uploading ? '…' : 'Add'}</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handlePick} />
    </div>
  );
}
