import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Check, X as XIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/comments/all');
    setComments(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setApproved = async (comment, approved) => {
    const { data } = await api.patch(`/comments/${comment._id}`, { approved });
    setComments((prev) => prev.map((c) => (c._id === data._id ? { ...c, approved: data.approved } : c)));
  };

  const remove = async (comment) => {
    if (!window.confirm(`Delete comment from ${comment.name}?`)) return;
    await api.delete(`/comments/${comment._id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Comments</h1>
      <p className="text-slate-500 text-sm mb-6">
        New comments start hidden until approved, to keep spam off the live site.
      </p>

      {loading && <p className="text-slate-400">Loading…</p>}
      {!loading && comments.length === 0 && (
        <p className="text-slate-400">No comments yet — they'll show up here once visitors post on an achievement.</p>
      )}

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c._id} className={`glass-card p-5 ${!c.approved ? 'border-yellow-500/40' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-white font-semibold flex items-center gap-2">
                  {c.name}
                  <span
                    className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      c.approved ? 'bg-brand-teal/20 text-brand-teal' : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {c.approved ? 'Approved' : 'Pending'}
                  </span>
                </p>
                {c.achievement && (
                  <Link
                    to={`/achievements/${c.achievement.slug}`}
                    target="_blank"
                    className="text-xs text-brand-teal hover:underline"
                  >
                    on "{c.achievement.title}"
                  </Link>
                )}
                <p className="text-sm text-slate-400 mt-2 whitespace-pre-wrap">{c.message}</p>
                <p className="text-xs text-slate-600 mt-2">{new Date(c.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {c.approved ? (
                  <button
                    onClick={() => setApproved(c, false)}
                    className="p-2 text-slate-400 hover:text-yellow-400"
                    title="Unapprove"
                  >
                    <XIcon size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => setApproved(c, true)}
                    className="p-2 text-slate-400 hover:text-brand-teal"
                    title="Approve"
                  >
                    <Check size={16} />
                  </button>
                )}
                <button onClick={() => remove(c)} className="p-2 text-slate-400 hover:text-red-400" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
