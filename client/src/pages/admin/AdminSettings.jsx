import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save, Download } from 'lucide-react';
import { api } from '../../api/client';
import RichTextEditor from '../../components/richtext/RichTextEditor.jsx';
import MediaUploadField from '../../components/admin/MediaUploadField.jsx';
import MultiImageUploadField from '../../components/admin/MultiImageUploadField.jsx';
import StyledQR, { downloadStyledQr } from '../../components/StyledQR.jsx';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-teal';

function TextInput({ label, textarea, rows = 2, ...props }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">{label}</label>
      <Tag {...props} rows={textarea ? rows : undefined} className={`${inputClass} ${textarea ? 'resize-none' : ''}`} />
    </div>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [qrCanvas, setQrCanvas] = useState(null);

  useEffect(() => {
    api.get('/settings').then(({ data }) => setSettings(data));
  }, []);

  if (!settings) {
    return <div className="text-slate-400">Loading…</div>;
  }

  const field = (name) => ({
    value: settings[name] || '',
    onChange: (e) => setSettings({ ...settings, [name]: e.target.value })
  });

  const arrayField = (name) => ({
    value: (settings[name] || []).join('\n'),
    onChange: (e) => setSettings({ ...settings, [name]: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })
  });

  const navField = (key) => ({
    value: settings.navLabels?.[key] || '',
    onChange: (e) => setSettings({ ...settings, navLabels: { ...settings.navLabels, [key]: e.target.value } })
  });

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/settings', settings);
      setSettings(data);
      toast.success('Site settings saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Site Settings</h1>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-brand-teal text-[#08122c] font-semibold text-sm hover:brightness-110 disabled:opacity-60"
        >
          <Save size={16} /> {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
      <p className="text-slate-400 text-sm mb-6">
        Every piece of text visible on the public site — nav, hero, section titles, footer, SEO — lives here.
      </p>

      <div className="glass-card p-6 space-y-6">
        <section className="space-y-4">
          <h2 className="text-brand-teal text-sm font-semibold uppercase tracking-wide">Identity</h2>
          <TextInput label="Full name" {...field('fullName')} />
          <TextInput label="Short brand name (top-left of nav bar)" {...field('shortName')} />
          <TextInput
            label="Also known as (one per line — helps every search of your names find you)"
            textarea
            rows={4}
            {...arrayField('akaNames')}
          />
          <TextInput
            label='Small label before the aka names under the tagline (e.g. "aka" — leave blank to hide the word)'
            {...field('heroAkaLabel')}
          />
          <TextInput label="Tagline" {...field('tagline')} />
          <TextInput
            label="Hero marquee roles (one per line — what you do, rotates under the tagline)"
            textarea
            rows={4}
            {...arrayField('roles')}
          />
          <TextInput label="Hero subtitle" textarea {...field('heroSubtitle')} />
          <MediaUploadField
            label="Hero / profile photo"
            value={settings.heroImage}
            onChange={(url) => setSettings({ ...settings, heroImage: url })}
            accept="image/*"
            kind="image"
          />
          <MultiImageUploadField
            label="Extra profile photos (optional — 2+ turns the hero photo into an auto-playing carousel)"
            values={settings.heroImages || []}
            onChange={(heroImages) => setSettings({ ...settings, heroImages })}
          />
          <MediaUploadField
            label="Resume (PDF)"
            value={settings.resumeUrl}
            onChange={(url) => setSettings({ ...settings, resumeUrl: url })}
            accept="application/pdf"
            kind="file"
          />
        </section>

        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-brand-teal text-sm font-semibold uppercase tracking-wide">Navigation labels</h2>
          <p className="text-xs text-slate-500 -mt-2">
            Only the visible link text changes — each still scrolls to its section.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput label="About" {...navField('about')} />
            <TextInput label="Skills" {...navField('skills')} />
            <TextInput label="Experience" {...navField('experience')} />
            <TextInput label="Education" {...navField('education')} />
            <TextInput label="Projects" {...navField('projects')} />
            <TextInput label="Achievements" {...navField('achievements')} />
            <TextInput label="Recommendations" {...navField('recommendations')} />
            <TextInput label="Connect" {...navField('connect')} />
            <TextInput label="Links" {...navField('links')} />
          </div>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-brand-teal text-sm font-semibold uppercase tracking-wide">Hero buttons</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput label="Primary button text" {...field('heroCtaPrimaryText')} />
            <TextInput label="Primary button link" {...field('heroCtaPrimaryLink')} />
            <TextInput label="Secondary button text" {...field('heroCtaSecondaryText')} />
            <TextInput label="Secondary button link" {...field('heroCtaSecondaryLink')} />
            <TextInput label="Resume button text" {...field('resumeButtonText')} />
          </div>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-brand-teal text-sm font-semibold uppercase tracking-wide">About Me</h2>
          <TextInput label="Section title" {...field('aboutTitle')} />
          <RichTextEditor value={settings.aboutHtml} onChange={(html) => setSettings({ ...settings, aboutHtml: html })} />
        </section>

        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-brand-teal text-sm font-semibold uppercase tracking-wide">Skills, Experience &amp; Education</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput label="Skills section title" {...field('skillsTitle')} />
            <TextInput label="Experience & Education section title" {...field('experienceTitle')} />
            <TextInput label="Employment column label" {...field('employmentLabel')} />
            <TextInput label="Education column label" {...field('educationLabel')} />
          </div>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-brand-teal text-sm font-semibold uppercase tracking-wide">Projects</h2>
          <TextInput label="Section title" {...field('projectsTitle')} />
          <TextInput label="Section subtitle" textarea {...field('projectsSubtitle')} />
        </section>

        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-brand-teal text-sm font-semibold uppercase tracking-wide">Achievements</h2>
          <TextInput label="Section title" {...field('achievementsTitle')} />
          <TextInput label="Section subtitle" textarea {...field('achievementsSubtitle')} />
        </section>

        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-brand-teal text-sm font-semibold uppercase tracking-wide">Recommendations</h2>
          <TextInput label="Section title" {...field('recommendationsTitle')} />
          <TextInput label="Section subtitle" textarea {...field('recommendationsSubtitle')} />
        </section>

        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-brand-teal text-sm font-semibold uppercase tracking-wide">Connect</h2>
          <TextInput label="Connect section title" {...field('connectTitle')} />
          <TextInput label="Connect section subtitle" textarea {...field('connectSubtitle')} />
        </section>

        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-brand-teal text-sm font-semibold uppercase tracking-wide">Links page &amp; QR code</h2>
          <p className="text-xs text-slate-500 -mt-2">
            Controls the standalone <code>/links</code> page (your shareable "link in bio" page) and the QR codes
            shown there and in the Connect section. Leave heading/subtitle blank to fall back to your name and
            tagline. QR colours apply everywhere the QR code appears — keep strong contrast between them so it
            still scans.
          </p>
          <TextInput label="Links page heading (blank = your full name)" {...field('linksPageHeading')} />
          <TextInput
            label="Links page subtitle (blank = your tagline)"
            textarea
            {...field('linksPageSubtitle')}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">QR code colour</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.qrColor || '#4FA8A8'}
                  onChange={(e) => setSettings({ ...settings, qrColor: e.target.value })}
                  className="w-10 h-10 rounded border border-white/10 bg-transparent cursor-pointer"
                />
                <input {...field('qrColor')} placeholder="#4FA8A8" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-400 mb-1">QR background colour</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.qrBgColor || '#08122c'}
                  onChange={(e) => setSettings({ ...settings, qrBgColor: e.target.value })}
                  className="w-10 h-10 rounded border border-white/10 bg-transparent cursor-pointer"
                />
                <input {...field('qrBgColor')} placeholder="#08122c" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-6">
            <StyledQR
              key={`${settings.qrColor}-${settings.qrBgColor}`}
              value={`${(settings.siteUrl || 'https://denisjovitusbuberwa.djb.co.tz').replace(/\/$/, '')}/links`}
              size={200}
              logoUrl="/logo/icon-192.png"
              color={settings.qrColor || '#4FA8A8'}
              bgColor={settings.qrBgColor || '#08122c'}
              onReady={setQrCanvas}
              className="rounded-lg"
            />
            <button
              type="button"
              onClick={() => downloadStyledQr(qrCanvas, 'djb-links-qr.png')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Download size={14} /> Download this QR as PNG
            </button>
            <p className="text-[10px] uppercase tracking-wide text-slate-700">Live preview — save changes above to apply site-wide</p>
          </div>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-brand-teal text-sm font-semibold uppercase tracking-wide">Footer</h2>
          <p className="text-xs text-slate-500 -mt-2">
            This is the very bottom bar of the site. Every piece below is independently editable — clear a field
            and leave it blank to drop it from the line entirely (e.g. clear the copyright symbol, untick the
            year, or clear the tagline to leave just the name).
          </p>
          <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end">
            <TextInput
              label='Copyright symbol (e.g. "©" — leave blank to hide it)'
              {...field('footerCopyrightSymbol')}
            />
            <label className="flex items-center gap-2 text-sm text-slate-300 pb-2.5 whitespace-nowrap">
              <input
                type="checkbox"
                checked={settings.footerShowYear ?? true}
                onChange={(e) => setSettings({ ...settings, footerShowYear: e.target.checked })}
                className="w-4 h-4 accent-brand-teal"
              />
              Show current year
            </label>
          </div>
          <p className="text-xs text-slate-500 -mt-2">
            The name shown is the &ldquo;Full name&rdquo; field up in Identity — edit it there.
          </p>
          <TextInput
            label='Footer tagline (goes after "© year, full name." — leave blank to omit)'
            {...field('footerTagline')}
          />
          <TextInput
            label='"Also known as" label text (leave blank to hide just the label, names still show)'
            {...field('akaLabel')}
          />
          <TextInput
            label="Also known as names (one per line — leave empty to hide this whole line; also used in the Hero band above)"
            textarea
            rows={4}
            {...arrayField('akaNames')}
          />
          <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-center text-sm text-slate-500">
            {(() => {
              const symbol = settings.footerCopyrightSymbol ?? '©';
              const showYear = settings.footerShowYear ?? true;
              const name = settings.fullName ?? 'Denis Jovitus Buberwa';
              const tagline = settings.footerTagline ?? '';
              const akaLabel = settings.akaLabel ?? '';
              const lead = [symbol, showYear ? String(new Date().getFullYear()) : '', name].filter(Boolean).join(' ');
              const line1 = [lead && `${lead}.`, tagline].filter(Boolean).join(' ');
              return (
                <>
                  {line1 ? <p>{line1}</p> : <p className="italic text-slate-700">(copyright line hidden — everything blank)</p>}
                  {settings.akaNames?.length > 0 && (
                    <p className="mt-1 text-xs text-slate-600">
                      {akaLabel ? `${akaLabel} ` : ''}
                      {settings.akaNames.join(' · ')}
                    </p>
                  )}
                </>
              );
            })()}
            <p className="mt-2 text-[10px] uppercase tracking-wide text-slate-700">Live preview</p>
          </div>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-brand-teal text-sm font-semibold uppercase tracking-wide">Contact details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput label="Location" {...field('location')} />
            <TextInput label="Email" {...field('email')} />
            <TextInput label="Phone" {...field('phone')} />
          </div>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-brand-teal text-sm font-semibold uppercase tracking-wide">SEO</h2>
          <TextInput label="Site URL (used for sitemap.xml)" {...field('siteUrl')} />
          <TextInput label="SEO title" {...field('seoTitle')} />
          <TextInput label="SEO description" textarea {...field('seoDescription')} />
          <TextInput
            label="SEO keywords (one per line — include every name variant you want found under)"
            textarea
            rows={5}
            {...arrayField('seoKeywords')}
          />
        </section>
      </div>
    </div>
  );
}
