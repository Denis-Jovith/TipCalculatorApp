import GenericCrud from '../../components/admin/GenericCrud.jsx';

const ICONS = [
  'Github',
  'Linkedin',
  'Mail',
  'Phone',
  'Instagram',
  'Twitter',
  'Facebook',
  'Youtube',
  'TikTok',
  'Threads',
  'MessageCircle',
  'Music2',
  'Globe'
];

export default function AdminSocial() {
  return (
    <GenericCrud
      title="Social Links"
      endpoint="/social-links"
      emptyItem={{ platform: '', url: '', icon: 'Globe', order: 0, visible: true }}
      columns={[
        { key: 'platform', label: 'Platform' },
        { key: 'url', label: 'URL' },
        { key: 'visible', label: 'Visible', render: (i) => (i.visible ? 'Yes' : 'No') }
      ]}
      fields={[
        { name: 'platform', label: 'Platform name (e.g. GitHub, Instagram, WhatsApp)', type: 'text' },
        { name: 'url', label: 'URL (mailto:/tel: allowed)', type: 'text' },
        { name: 'icon', label: 'Icon', type: 'select', options: ICONS },
        { name: 'order', label: 'Order', type: 'number' },
        { name: 'visible', label: 'Show on site', type: 'boolean' }
      ]}
    />
  );
}
