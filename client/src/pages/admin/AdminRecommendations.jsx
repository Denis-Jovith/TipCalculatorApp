import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Save, ArrowUp, ArrowDown, Check, ThumbsUp, ThumbsDown, Mail, Phone } from 'lucide-react';
import { api } from '../../api/client';
import MediaUploadField from '../../components/admin/MediaUploadField.jsx';
import StarRating from '../../components/StarRating.jsx';
import { reorderItem } from '../../utils/reorder.js';

const emptyRecommendation = {
  name: '',
  title: '',
  company: '',
  relationship: '',
  message: '',
  rating: 5,
  recommend: true,
  photo: '',
  contactEmail: '',
  contactPhone: '',
  approved: true
};

export default function AdminRecommendations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/recommendations/all');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => setEditing({ ...emptyRecommendation });
  const openEdit = (r) => setEditing({ ...emptyRecommendation, ...r });
  const close = () => setEditing(null);

  const move = (index, direction) =>
    reorderItem({ items, index, direction, endpoint: '/recommendations', setItems, reload: load });

  const save = async () => {
    setSaving(true);
    try {
      if (editing._id) {
        await api.put(`/recommendations/${editing._id}`, editing);
      } else {
        await api.post('/recommendations', editing);
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

  const setApproved = async (item, approved) => {
    const { data } = await api.put(`/recommendations/${item._id}`, { approved });
    setItems((prev) => prev.map((r) => (r._id === data._id ? data : r)));
  };

  const remove = async (r) => {
    if (!window.confirm(`Delete the recommendation from ${r.name}?`)) return;
    try {
      await api.delete(`/recommendations/${r._id}`);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Recommendations</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal text-[#08122c] font-semibold text-sm hover:brightness-110"
        >
          <Plus size={16} /> New recommendation
        </button>
      </div>
      <p className="text-slate-500 text-sm mb-4">
        Ones submitted from the public site start pending — approve them here before they go live. Ones you add
        yourself are approved immediately.
      </p>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 w-20">Order</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Recommends</th>
              <th className="px-4 py-3">Status</th>
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
                  Nothing here yet.
                </td>
              </tr>
            )}
            {items.map((r, index) => (
              <tr key={r._id} className="text-slate-200 hover:bg-white/5">
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
                <td className="px-4 py-3">
                  <p>{r.name}</p>
                  {(r.title || r.company) && (
                    <p className="text-xs text-slate-500">{[r.title, r.company].filter(Boolean).join(' · ')}</p>
                  )}
                  {(r.contactEmail || r.contactPhone) && (
                    <p className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5" title="Private — only visible here">
                      {r.contactEmail && (
                        <span className="flex items-center gap-1">
                          <Mail size={10} /> {r.contactEmail}
                        </span>
                      )}
                      {r.contactPhone && (
                        <span className="flex items-center gap-1">
                          <Phone size={10} /> {r.contactPhone}
                        </span>
                      )}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StarRating value={r.rating} size={14} />
                </td>
                <td className="px-4 py-3">
                  {r.recommend ? (
                    <ThumbsUp size={16} className="text-brand-teal" />
                  ) : (
                    <ThumbsDown size={16} className="text-slate-500" />
                  )}
                </td>
                <td className="px-4 py-3">
                  {r.approved ? (
                    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-brand-teal/20 text-brand-teal">
                      Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => setApproved(r, true)}
                      className="flex items-center gap-1 text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                    >
                      <Check size={10} /> Approve
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(r)} className="p-1.5 text-slate-400 hover:text-brand-teal">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => remove(r)} className="p-1.5 text-slate-400 hover:text-red-400">
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
          <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">{editing._id ? 'Edit' : 'New'} recommendation</h2>
              <button onClick={close} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
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
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Company / office</label>
                  <input
                    type="text"
                    value={editing.company}
                    onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                    Where they met / worked with you
                  </label>
                  <input
                    type="text"
                    value={editing.relationship}
                    onChange={(e) => setEditing({ ...editing, relationship: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Message</label>
                <textarea
                  rows={4}
                  value={editing.message}
                  onChange={(e) => setEditing({ ...editing, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal resize-none"
                />
              </div>

              <MediaUploadField
                label="Photo (optional)"
                value={editing.photo}
                onChange={(url) => setEditing({ ...editing, photo: url })}
                accept="image/*"
                kind="image"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                    Contact email (private)
                  </label>
                  <input
                    type="email"
                    value={editing.contactEmail}
                    onChange={(e) => setEditing({ ...editing, contactEmail: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                    Contact phone (private)
                  </label>
                  <input
                    type="tel"
                    value={editing.contactPhone}
                    onChange={(e) => setEditing({ ...editing, contactPhone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                  />
                </div>
              </div>
              <p className="text-slate-500 text-xs -mt-2">Never shown on the public site — for your reference only.</p>

              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Rating</p>
                  <StarRating value={editing.rating} onChange={(rating) => setEditing({ ...editing, rating })} />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={editing.recommend}
                    onChange={(e) => setEditing({ ...editing, recommend: e.target.checked })}
                    className="w-4 h-4 accent-brand-teal"
                  />
                  Recommends Denis
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={editing.approved}
                    onChange={(e) => setEditing({ ...editing, approved: e.target.checked })}
                    className="w-4 h-4 accent-brand-teal"
                  />
                  Approved (visible on site)
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
