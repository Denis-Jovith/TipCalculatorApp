import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';
import { api } from '../api/client';
import SocialBar from './SocialBar.jsx';
import QRConnectCard from './QRConnectCard.jsx';

const emptyForm = { name: '', email: '', subject: '', message: '' };
const inputClass =
  'w-full bg-surface border border-surface-border rounded-lg px-4 py-3 text-sm text-fg placeholder:text-faint focus:outline-none focus:border-brand-teal';

export default function ContactSection({ socialLinks = [], settings }) {
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post('/messages', form);
      toast.success(data.message || 'Message sent!');
      setForm(emptyForm);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="connect" className="relative py-24 px-5 sm:px-8 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 1, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-title mb-3 text-center"
      >
        {settings?.connectTitle || "Let's Connect"}
      </motion.h2>
      <p className="text-center text-muted mb-12">
        {settings?.connectSubtitle || 'Have a project in mind, or just want to say hi? Reach out on any platform below.'}
      </p>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <motion.form
          initial={{ opacity: 1, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="glass-card p-6 sm:p-8 space-y-4"
          aria-label="Contact form"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className="sr-only">
                Your name
              </label>
              <input
                id="contact-name"
                required
                autoComplete="name"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="sr-only">
                Your email
              </label>
              <input
                id="contact-email"
                required
                type="email"
                autoComplete="email"
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="contact-subject" className="sr-only">
              Subject
            </label>
            <input
              id="contact-subject"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="sr-only">
              Your message
            </label>
            <textarea
              id="contact-message"
              required
              rows={5}
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={`${inputClass} resize-none`}
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-teal text-[#08122c] font-semibold hover:brightness-110 transition disabled:opacity-60"
          >
            <Send size={16} aria-hidden="true" /> {sending ? 'Sending…' : 'Send message'}
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 1, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          <SocialBar socialLinks={socialLinks} variant="grid" />
          <div>
            <SocialBar socialLinks={socialLinks} variant="bar" />
          </div>
          <QRConnectCard settings={settings} />
        </motion.div>
      </div>
    </section>
  );
}
