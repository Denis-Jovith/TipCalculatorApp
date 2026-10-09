import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { api } from '../../api/client';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/messages');
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRead = async (msg) => {
    const { data } = await api.patch(`/messages/${msg._id}`, { read: !msg.read });
    setMessages((prev) => prev.map((m) => (m._id === data._id ? data : m)));
  };

  const remove = async (msg) => {
    if (!window.confirm(`Delete message from ${msg.name}?`)) return;
    await api.delete(`/messages/${msg._id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Messages</h1>

      {loading && <p className="text-slate-400">Loading…</p>}
      {!loading && messages.length === 0 && (
        <p className="text-slate-400">No messages yet — they'll show up here when someone uses the contact form.</p>
      )}

      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg._id} className={`glass-card p-5 ${!msg.read ? 'border-brand-teal/50' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-white font-semibold flex items-center gap-2">
                  {msg.name}
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-brand-teal" />}
                </p>
                <a href={`mailto:${msg.email}`} className="text-sm text-brand-teal hover:underline">
                  {msg.email}
                </a>
                {msg.subject && <p className="text-sm text-slate-300 mt-1 font-medium">{msg.subject}</p>}
                <p className="text-sm text-slate-400 mt-2 whitespace-pre-wrap">{msg.message}</p>
                <p className="text-xs text-slate-600 mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => toggleRead(msg)}
                  className="p-2 text-slate-400 hover:text-brand-teal"
                  title={msg.read ? 'Mark unread' : 'Mark read'}
                >
                  {msg.read ? <MailOpen size={16} /> : <Mail size={16} />}
                </button>
                <button onClick={() => remove(msg)} className="p-2 text-slate-400 hover:text-red-400" title="Delete">
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
