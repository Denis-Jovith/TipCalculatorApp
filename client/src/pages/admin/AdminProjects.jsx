import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { api } from '../../api/client';
import RichTextEditor from '../../components/richtext/RichTextEditor.jsx';
import MediaUploadField from '../../components/admin/MediaUploadField.jsx';
import { reorderItem } from '../../utils/reorder.js';

const CATEGORIES = ['web', 'mobile', 'blender', 'other'];

const emptyProject = {
  title: '',
  category: 'web',
  summary: '',
  descriptionHtml: '',
  thumbnail: '',
  videoUrl: '',
  videoStartTime: 0,
  videoEndTime: '',
  videoMuted: true,
  liveUrl: '',
  repoUrl: '',
  tags: [],
  featured: false,
  published: true,
  order: 0
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/projects?all=true');
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => setEditing({ ...emptyProject });
  const openEdit = (p) =>
    setEditing({ ...p, tags: (p.tags || []).join('\n'), videoEndTime: p.videoEndTime ?? '' });
  const close = () => setEditing(null);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...editing,
        tags: typeof editing.tags === 'string' ? editing.tags.split('\n').map((t) => t.trim()).filter(Boolean) : editing.tags,
        videoEndTime: editing.videoEndTime === '' ? null : Number(editing.videoEndTime)
      };
      if (editing._id) {
        await api.put(`/projects/${editing._id}`, payload);
      } else {
        await api.post('/projects', payload);
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

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/projects/${p._id}`);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const move = (index, direction) =>
    reorderItem({ items: projects, index, direction, endpoint: '/projects', setItems: setProjects, reload: load });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal text-[#08122c] font-semibold text-sm hover:brightness-110"
        >
          <Plus size={16} /> New project
        </button>
      </div>
      <p className="text-slate-500 text-sm mb-4">
        Use the arrows to reorder — featured projects always show first, then this order (leftmost card first).
      </p>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 w-20">Order</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Published</th>
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
            {!loading && projects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No projects yet — click "New project" to add one.
                </td>
              </tr>
            )}
            {projects.map((p, index) => (
              <tr key={p._id} className="text-slate-200 hover:bg-white/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-brand-teal disabled:opacity-20 disabled:cursor-not-allowed"
                      title="Move up (shows earlier / leftmost)"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => move(index, 1)}
                      disabled={index === projects.length - 1}
                      className="p-1 text-slate-400 hover:text-brand-teal disabled:opacity-20 disabled:cursor-not-allowed"
                      title="Move down (shows later / rightmost)"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3 capitalize">{p.category}</td>
                <td className="px-4 py-3">{p.featured ? 'Yes' : ''}</td>
                <td className="px-4 py-3">{p.published ? 'Yes' : 'Draft'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 hover:text-brand-teal">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => remove(p)} className="p-1.5 text-slate-400 hover:text-red-400">
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
              <h2 className="text-lg font-semibold text-white">{editing._id ? 'Edit' : 'New'} project</h2>
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
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Full description
                </label>
                <RichTextEditor
                  value={editing.descriptionHtml}
                  onChange={(html) => setEditing((prev) => ({ ...prev, descriptionHtml: html }))}
                  placeholder="Tell the story of this project — what you built, why, and how…"
                />
              </div>

              <MediaUploadField
                label="Thumbnail image"
                value={editing.thumbnail}
                onChange={(url) => setEditing({ ...editing, thumbnail: url })}
                accept="image/*"
                kind="image"
              />

              {editing.category === 'blender' && (
                <>
                  <MediaUploadField
                    label="Showreel video"
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
                        Loops this range only — the full video isn't trimmed, just what plays here. Replaying always
                        restarts from "Start at".
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                    Live URL (enables live preview)
                  </label>
                  <input
                    type="text"
                    value={editing.liveUrl}
                    onChange={(e) => setEditing({ ...editing, liveUrl: e.target.value })}
                    placeholder="https://…"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Repo URL</label>
                  <input
                    type="text"
                    value={editing.repoUrl}
                    onChange={(e) => setEditing({ ...editing, repoUrl: e.target.value })}
                    placeholder="https://github.com/…"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Tags (one per line)
                </label>
                <textarea
                  rows={3}
                  value={editing.tags}
                  onChange={(e) => setEditing({ ...editing, tags: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal resize-none"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="w-4 h-4 accent-brand-teal"
                  />
                  Featured
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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Order</span>
                  <input
                    type="number"
                    value={editing.order}
                    onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })}
                    className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
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
