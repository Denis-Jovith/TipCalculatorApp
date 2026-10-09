import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Save, Download, QrCode as QrCodeIcon } from 'lucide-react';
import { api } from '../../api/client';
import StyledQR, { downloadStyledQr } from '../../components/StyledQR.jsx';
import MediaUploadField from '../../components/admin/MediaUploadField.jsx';

const EMPTY = { name: '', value: '', color: '#4FA8A8', bgColor: '#08122c', logoUrl: '', logoSize: 0.22, order: 0 };

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal';

// A reusable gallery of independent QR designs - each with its own colours, logo and
// target URL/text - separate from the single site-wide QR config in Site Settings.
// Modelled on the "Saved QR codes" gallery seen in the ATCL SACCOS admin panel.
export default function AdminQrCodes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [canvases, setCanvases] = useState({});
  const [modalCanvas, setModalCanvas] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/qr-designs');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => setEditing({ ...EMPTY });
  const openEdit = (item) => setEditing({ ...item });
  const close = () => {
    setEditing(null);
    setModalCanvas(null);
  };

  const save = async () => {
    if (!editing.name?.trim() || !editing.value?.trim()) {
      toast.error('Name and value/URL are both required');
      return;
    }
    setSaving(true);
    try {
      if (editing._id) {
        await api.put(`/qr-designs/${editing._id}`, editing);
      } else {
        await api.post('/qr-designs', editing);
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
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/qr-designs/${item._id}`);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const downloadCard = (item) => {
    const canvas = canvases[item._id];
    if (!canvas) {
      toast.error('QR is still rendering — try again in a moment.');
      return;
    }
    downloadStyledQr(canvas, `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-qr.png`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-white">QR Codes</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal text-[#08122c] font-semibold text-sm hover:brightness-110"
        >
          <Plus size={16} /> New QR design
        </button>
      </div>
      <p className="text-slate-400 text-sm mb-6">
        Independent, reusable QR codes for any purpose — a business card, a flyer, a specific campaign link.
        Each one keeps its own colours, logo and target URL. The link-page/homepage QR is configured
        separately under Site Settings.
      </p>

      {loading && <p className="text-slate-400">Loading…</p>}

      {!loading && items.length === 0 && (
        <div className="glass-card p-10 text-center text-slate-400">
          No saved QR designs yet — click "New QR design" to create one.
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item._id} className="glass-card p-5 flex flex-col items-center gap-3 text-center">
            <StyledQR
              value={item.value}
              size={160}
              logoUrl={item.logoUrl}
              logoSize={item.logoSize ?? 0.22}
              color={item.color || '#4FA8A8'}
              bgColor={item.bgColor || '#08122c'}
              onReady={(canvas) => setCanvases((prev) => ({ ...prev, [item._id]: canvas }))}
              className="rounded-lg"
            />
            <div className="min-w-0 w-full">
              <p className="text-white font-semibold truncate">{item.name}</p>
              <p className="text-xs text-slate-500 truncate">{item.value}</p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => downloadCard(item)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-slate-200 text-xs hover:bg-white/20"
              >
                <Download size={13} /> Download
              </button>
              <button
                onClick={() => openEdit(item)}
                className="p-1.5 text-slate-400 hover:text-brand-teal"
                aria-label="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => remove(item)}
                className="p-1.5 text-slate-400 hover:text-red-400"
                aria-label="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <QrCodeIcon size={18} /> {editing._id ? 'Edit' : 'New'} QR design
              </h2>
              <button onClick={close} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Name</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Business card"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Value / URL</label>
                <input
                  type="text"
                  value={editing.value}
                  onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                  placeholder="https://…"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Colour</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editing.color || '#4FA8A8'}
                      onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                      className="w-10 h-10 rounded border border-white/10 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editing.color || ''}
                      onChange={(e) => setEditing({ ...editing, color: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editing.bgColor || '#08122c'}
                      onChange={(e) => setEditing({ ...editing, bgColor: e.target.value })}
                      className="w-10 h-10 rounded border border-white/10 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editing.bgColor || ''}
                      onChange={(e) => setEditing({ ...editing, bgColor: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <MediaUploadField
                label="Logo (optional — shown at the centre)"
                value={editing.logoUrl}
                onChange={(url) => setEditing({ ...editing, logoUrl: url })}
                accept="image/*"
                kind="image"
              />

              <div>
                <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Logo size — {Math.round((editing.logoSize ?? 0.22) * 100)}% of the QR
                </label>
                <input
                  type="range"
                  min={0.12}
                  max={0.28}
                  step={0.01}
                  value={editing.logoSize ?? 0.22}
                  onChange={(e) => setEditing({ ...editing, logoSize: Number(e.target.value) })}
                  className="w-full accent-brand-teal"
                />
                <p className="text-[11px] text-amber-400/80 mt-1">
                  Keep this between 12% and 28% for reliable scanning — this range is enforced automatically.
                </p>
              </div>

              {editing.value && (
                <div className="flex flex-col items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-5">
                  <StyledQR
                    key={`${editing.color}-${editing.bgColor}-${editing.logoUrl}-${editing.logoSize}`}
                    value={editing.value}
                    size={180}
                    logoUrl={editing.logoUrl}
                    logoSize={editing.logoSize ?? 0.22}
                    color={editing.color || '#4FA8A8'}
                    bgColor={editing.bgColor || '#08122c'}
                    onReady={setModalCanvas}
                    className="rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => downloadStyledQr(modalCanvas, 'qr-preview.png')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-white text-xs font-medium hover:bg-white/10"
                  >
                    <Download size={13} /> Download this preview
                  </button>
                </div>
              )}
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
