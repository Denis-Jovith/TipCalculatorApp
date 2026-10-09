import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { api } from '../../api/client';
import { reorderItem } from '../../utils/reorder.js';

// Drives a full list + create/edit/delete UI for simple content types (Skills, Experience,
// Education, Social links) from a small field schema, so each admin screen doesn't
// have to hand-roll the same table/modal/CRUD wiring.
export default function GenericCrud({ title, endpoint, fields, columns, emptyItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, object = editing
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get(`${endpoint}?all=true`);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const openNew = () => setEditing({ ...emptyItem });
  const openEdit = (item) => setEditing({ ...item });
  const close = () => setEditing(null);

  const handleField = (name, value) => setEditing((prev) => ({ ...prev, [name]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...editing };
      fields
        .filter((f) => f.type === 'string-array')
        .forEach((f) => {
          if (typeof payload[f.name] === 'string') {
            payload[f.name] = payload[f.name]
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean);
          }
        });

      if (editing._id) {
        await api.put(`${endpoint}/${editing._id}`, payload);
      } else {
        await api.post(endpoint, payload);
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

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item[columns[0].key]}"? This cannot be undone.`)) return;
    try {
      await api.delete(`${endpoint}/${item._id}`);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const orderable = fields.some((f) => f.name === 'order');
  const move = (index, direction) => reorderItem({ items, index, direction, endpoint, setItems, reload: load });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal text-[#08122c] font-semibold text-sm hover:brightness-110"
        >
          <Plus size={16} /> New
        </button>
      </div>
      {orderable && (
        <p className="text-slate-500 text-sm mb-4">
          Use the arrows to reorder — the item at the top shows first on the live site.
        </p>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-slate-400 uppercase text-xs">
            <tr>
              {orderable && <th className="px-4 py-3 w-20">Order</th>}
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && (
              <tr>
                <td colSpan={columns.length + 1 + (orderable ? 1 : 0)} className="px-4 py-6 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1 + (orderable ? 1 : 0)} className="px-4 py-6 text-center text-slate-400">
                  Nothing here yet — click "New" to add one.
                </td>
              </tr>
            )}
            {items.map((item, index) => (
              <tr key={item._id} className="text-slate-200 hover:bg-white/5">
                {orderable && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-brand-teal disabled:opacity-20 disabled:cursor-not-allowed"
                        title="Move up (shows earlier / first)"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => move(index, 1)}
                        disabled={index === items.length - 1}
                        className="p-1 text-slate-400 hover:text-brand-teal disabled:opacity-20 disabled:cursor-not-allowed"
                        title="Move down (shows later / last)"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 max-w-xs truncate">
                    {col.render ? col.render(item) : String(item[col.key] ?? '')}
                  </td>
                ))}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-slate-400 hover:text-brand-teal">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => remove(item)} className="p-1.5 text-slate-400 hover:text-red-400">
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
          <div className="glass-card w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">{editing._id ? 'Edit' : 'New'} {title.slice(0, -1) || title}</h2>
              <button onClick={close} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{f.label}</label>
                  {f.type === 'boolean' ? (
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={!!editing[f.name]}
                        onChange={(e) => handleField(f.name, e.target.checked)}
                        className="w-4 h-4 accent-brand-teal"
                      />
                      Enabled
                    </label>
                  ) : f.type === 'textarea' || f.type === 'string-array' ? (
                    <textarea
                      rows={f.type === 'string-array' ? 4 : 3}
                      value={
                        Array.isArray(editing[f.name]) ? editing[f.name].join('\n') : editing[f.name] || ''
                      }
                      onChange={(e) => handleField(f.name, e.target.value)}
                      placeholder={f.type === 'string-array' ? 'One item per line' : ''}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal resize-none"
                    />
                  ) : f.type === 'number' ? (
                    <input
                      type="number"
                      min={f.min}
                      max={f.max}
                      value={editing[f.name] ?? ''}
                      onChange={(e) => handleField(f.name, Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                    />
                  ) : f.type === 'select' ? (
                    <select
                      value={editing[f.name] || ''}
                      onChange={(e) => handleField(f.name, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                    >
                      {f.options.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#150f3d]">
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={editing[f.name] || ''}
                      onChange={(e) => handleField(f.name, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal"
                    />
                  )}
                </div>
              ))}
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
