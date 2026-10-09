import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { X, ThumbsUp, ThumbsDown, Send, ImagePlus, Loader2 } from 'lucide-react';
import { api } from '../api/client';
import StarRating from './StarRating.jsx';

const emptyForm = {
  name: '',
  title: '',
  company: '',
  relationship: '',
  message: '',
  rating: 5,
  recommend: true,
  photo: '',
  contactEmail: '',
  contactPhone: ''
};
const inputClass =
  'w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-fg placeholder:text-faint focus:outline-none focus:border-brand-teal';

export default function RecommendationFormModal({ open, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  if (!open) return null;

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const { data } = await api.post('/recommendations/photo', body, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm((f) => ({ ...f, photo: data.url }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post('/recommendations', form);
      toast.success(data.message || 'Thanks for the recommendation!');
      setForm(emptyForm);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Leave a recommendation"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="modal-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-fg">Leave a recommendation</h2>
            <button onClick={onClose} className="text-muted hover:text-fg" aria-label="Close">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="rec-name" className="block text-xs uppercase tracking-wide text-muted mb-1">
                  Your name
                </label>
                <input
                  id="rec-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="rec-title" className="block text-xs uppercase tracking-wide text-muted mb-1">
                  Your title
                </label>
                <input
                  id="rec-title"
                  placeholder="e.g. Branch Manager"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="rec-company" className="block text-xs uppercase tracking-wide text-muted mb-1">
                  Company / office
                </label>
                <input
                  id="rec-company"
                  placeholder="e.g. ATCL SACCOS"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="rec-relationship" className="block text-xs uppercase tracking-wide text-muted mb-1">
                  Where you met / worked together
                </label>
                <input
                  id="rec-relationship"
                  placeholder="e.g. Colleague at NMB Bank"
                  value={form.relationship}
                  onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <p className="block text-xs uppercase tracking-wide text-muted mb-1">Your photo (optional)</p>
              <div className="flex items-center gap-3">
                {form.photo ? (
                  <img src={form.photo} alt="" className="w-12 h-12 rounded-full object-cover border border-surface-border" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-surface border border-dashed border-surface-border flex items-center justify-center text-faint">
                    <ImagePlus size={18} aria-hidden="true" />
                  </div>
                )}
                <label className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-surface-border text-sm text-muted hover:bg-surface cursor-pointer">
                  {uploadingPhoto ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <ImagePlus size={14} aria-hidden="true" />}
                  {form.photo ? 'Change photo' : 'Add a photo'}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    disabled={uploadingPhoto}
                    className="sr-only"
                  />
                </label>
                {form.photo && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, photo: '' })}
                    className="text-xs text-faint hover:text-fg underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-faint text-xs mt-1">
                Totally optional — but it helps Denis know exactly who you are.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="rec-email" className="block text-xs uppercase tracking-wide text-muted mb-1">
                  Your email (optional, private)
                </label>
                <input
                  id="rec-email"
                  type="email"
                  placeholder="Only Denis will see this"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="rec-phone" className="block text-xs uppercase tracking-wide text-muted mb-1">
                  Your phone (optional, private)
                </label>
                <input
                  id="rec-phone"
                  type="tel"
                  placeholder="Only Denis will see this"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <p className="text-faint text-xs -mt-2">
              Your email/phone are just so Denis can reach you if needed — they're never shown publicly.
            </p>

            <div>
              <label htmlFor="rec-message" className="block text-xs uppercase tracking-wide text-muted mb-1">
                Your recommendation
              </label>
              <textarea
                id="rec-message"
                required
                rows={4}
                placeholder="How would you describe working with Denis?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted mb-1">Rating</p>
                <StarRating value={form.rating} onChange={(rating) => setForm({ ...form, rating })} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted mb-1">Would you recommend Denis?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, recommend: true })}
                    aria-pressed={form.recommend === true}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      form.recommend
                        ? 'bg-brand-teal text-[#08122c] border-brand-teal'
                        : 'border-surface-border text-muted hover:bg-surface'
                    }`}
                  >
                    <ThumbsUp size={14} aria-hidden="true" /> Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, recommend: false })}
                    aria-pressed={form.recommend === false}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      !form.recommend
                        ? 'bg-surface-2 text-fg border-surface-border'
                        : 'border-surface-border text-muted hover:bg-surface'
                    }`}
                  >
                    <ThumbsDown size={14} aria-hidden="true" /> Not really
                  </button>
                </div>
              </div>
            </div>

            <p className="text-faint text-xs">Recommendations are reviewed before they appear publicly.</p>

            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-teal text-[#08122c] font-semibold text-sm hover:brightness-110 disabled:opacity-60"
            >
              <Send size={16} aria-hidden="true" /> {sending ? 'Sending…' : 'Submit recommendation'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
