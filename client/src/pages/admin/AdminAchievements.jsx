import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { api } from '../../api/client';
import RichTextEditor from '../../components/richtext/RichTextEditor.jsx';
import MediaUploadField from '../../components/admin/MediaUploadField.jsx';
import MultiImageUploadField from '../../components/admin/MultiImageUploadField.jsx';
import { reorderItem } from '../../utils/reorder.js';

const CATEGORIES = ['certification', 'milestone', 'award', 'event', 'other'];

const emptyAchievement = {
  title: '',
  category: 'milestone',
  date: '',
  summary: '',
  descriptionHtml: '',
  images: [],
  videoUrl: '',
  videoStartTime: 0,
  videoEndTime: '',
  videoMuted: true,
  documentUrl: '',
  documentLabel: 'Download certificate',
  downloadable: false,
  commentable: true,
  published: true,
  order: 0
};

export default function AdminAchievements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/achievements?all=true');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => setEditing({ ...emptyAchievement });
  const openEdit = (a) => setEditing({ ...a, videoEndTime: a.videoEndTime ?? '' });
  const close = () => setEditing(null);

  const move = (index, direction) =>
    reorderItem({ items, index, direction, endpoint: '/achievements', setItems, reload: load });

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...editing, videoEndTime: editing.videoEndTime === '' ? null : Number(editing.videoEndTime) };
      if (editing._id) {
        await api.put(`/achievements/${editing._id}`, payload);
      } else {
        await api.post('/achievements', payload);
      }
      toast.success('Saved');
      close();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (a) => {
    if (!window.confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/achievements/${a._id}`);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Achievements</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal text-[#08122c] font-semibold text-sm hover:brightness-110"
        >
          <Plus size={16} /> New achievement
        </button>
      </div>
      <p className="text-slate-500 text-sm mb-4">
        Certifications, awards, and memorable moments — each gets its own shareable page with optional download and
        comments.
      </p>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 w-20">Order</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Downloadable</th>
              <th className="px-4 py-3">Commentable</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  Nothing here yet — click "New achievement" to add one.
                </td>
              </tr>
            )}
            {items.map((a, index) => (
              <tr key={a._id} className="text-slate-200 hover:bg-white/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-brand-teal disabled:opacity-20 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                      className="p-1 text-slate-400 hover:text-brand-teal disabled:opacity-20 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">{a.title}</td>
                <td className="px-4 py-3 capitalize">{a.category}</td>
                <td className="px-4 py-3">{a.downloadable ? 'Yes' : ''}</td>
                <td className="px-4 py-3">{a.commentable ? 'Yes' : ''}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(a)} className="p-1.5 text-slate-400 hover:text-brand-teal">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => remove(a)} className="p-1.5 text-slate-400 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">{editing._id ? 'Edit' : 'New'} achievement</h2>
              <button onClick={close} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Category</label>
                  <select
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#150f3d] capitalize">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Date (e.g. "March 2025")
                </label>
                <input
                  type="text"
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Short summary (shown on cards)
                </label>
                <textarea
                  rows={2}
                  value={editing.summary}
                  onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Full description</label>
                <RichTextEditor
                  value={editing.descriptionHtml}
                  onChange={(html) => setEditing((prev) => ({ ...prev, descriptionHtml: html }))}
                  placeholder="Tell the story behind this achievement or moment…"
                />
              </div>

              <MultiImageUploadField
                label="Photos (2+ shows an auto-playing carousel)"
                values={editing.images}
                onChange={(images) => setEditing({ ...editing, images })}
              />

              <MediaUploadField
                label="Video (optional)"
                value={editing.videoUrl}
                onChange={(url) => setEditing({ ...editing, videoUrl: url })}
                accept="video/*"
                kind="video"
              />
              {editing.videoUrl && (
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                      Start at (seconds)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editing.videoStartTime}
                      onChange={(e) => setEditing({ ...editing, videoStartTime: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                      End at (seconds, optional)
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Full length"
                      value={editing.videoEndTime}
                      onChange={(e) => setEditing({ ...editing, videoEndTime: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                    />
                  </div>
                  <div className="flex items-end pb-2.5">
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={editing.videoMuted}
                        onChange={(e) => setEditing({ ...editing, videoMuted: e.target.checked })}
                        className="w-4 h-4 accent-brand-teal"
                      />
                      Muted by default
                    </label>
                  </div>
                  <p className="sm:col-span-3 text-xs text-slate-500 -mt-2">
                    On the achievement page, playback starts at "Start at" and stops at "End at" — the full video
                    stays intact, this is just what plays by default.
                  </p>
                </div>
              )}

              <MediaUploadField
                label="Document / certificate file (optional — PDF or image)"
                value={editing.documentUrl}
                onChange={(url) => setEditing({ ...editing, documentUrl: url })}
                accept="application/pdf,image/*"
                kind="file"
              />

              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Download button label
                </label>
                <input
                  type="text"
                  value={editing.documentLabel}
                  onChange={(e) => setEditing({ ...editing, documentLabel: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                />
              </div>

              <div className="flex items-center gap-6 flex-wrap">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={editing.downloadable}
                    onChange={(e) => setEditing({ ...editing, downloadable: e.target.checked })}
                    className="w-4 h-4 accent-brand-teal"
                  />
                  Downloadable
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={editing.commentable}
                    onChange={(e) => setEditing({ ...editing, commentable: e.target.checked })}
                    className="w-4 h-4 accent-brand-teal"
                  />
                  Commentable
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                    className="w-4 h-4 accent-brand-teal"
                  />
                  Published
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={close} className="px-4 py-2 rounded-full text-sm text-slate-300 hover:bg-white/10">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-brand-teal text-[#08122c] font-semibold text-sm hover:brightness-110 disabled:opacity-60"
              >
                <Save size={16} /> {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
