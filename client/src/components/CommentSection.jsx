import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MessageCircle, Send } from 'lucide-react';
import { api } from '../api/client';

export default function CommentSection({ achievementId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', message: '' });
  const [sending, setSending] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/comments', { params: { achievementId } })
      .then(({ data }) => setComments(data))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievementId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post('/comments', { achievementId, ...form });
      toast.success(data.message || 'Comment submitted');
      setForm({ name: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not post comment');
    } finally {
      setSending(false);
    }
  };

  return (
    <section aria-labelledby="comments-heading" className="mt-10">
      <h2 id="comments-heading" className="flex items-center gap-2 text-lg font-semibold text-fg mb-4">
        <MessageCircle size={18} aria-hidden="true" /> Comments{comments.length > 0 ? ` (${comments.length})` : ''}
      </h2>

      {loading && <p className="text-muted text-sm">Loading comments…</p>}
      {!loading && comments.length === 0 && <p className="text-muted text-sm mb-6">No comments yet — be the first.</p>}

      <ul className="space-y-4 mb-8">
        {comments.map((c) => (
          <li key={c._id} className="glass-card p-4">
            <p className="text-fg font-semibold text-sm">{c.name}</p>
            <p className="text-muted text-sm mt-1 whitespace-pre-wrap">{c.message}</p>
            <p className="text-faint text-xs mt-2">{new Date(c.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="glass-card p-5 space-y-3" aria-label="Post a comment">
        <div>
          <label htmlFor="comment-name" className="sr-only">
            Your name
          </label>
          <input
            id="comment-name"
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-fg placeholder:text-faint focus:outline-none focus:border-brand-teal"
          />
        </div>
        <div>
          <label htmlFor="comment-message" className="sr-only">
            Your comment
          </label>
          <textarea
            id="comment-message"
            required
            rows={3}
            placeholder="Leave a comment…"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm text-fg placeholder:text-faint focus:outline-none focus:border-brand-teal resize-none"
          />
        </div>
        <p className="text-faint text-xs">Comments are reviewed before they appear publicly.</p>
        <button
          type="submit"
          disabled={sending}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-brand-teal text-[#08122c] font-semibold text-sm hover:brightness-110 disabled:opacity-60"
        >
          <Send size={14} aria-hidden="true" /> {sending ? 'Posting…' : 'Post comment'}
        </button>
      </form>
    </section>
  );
}
