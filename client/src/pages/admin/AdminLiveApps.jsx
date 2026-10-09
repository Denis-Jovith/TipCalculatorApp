import GenericCrud from '../../components/admin/GenericCrud.jsx';

export default function AdminLiveApps() {
  return (
    <GenericCrud
      title="Live Applications"
      endpoint="/live-apps"
      emptyItem={{ name: '', url: '', description: '', status: 'live', order: 0, visible: true }}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'url', label: 'URL' },
        { key: 'status', label: 'Status' },
        { key: 'visible', label: 'Visible', render: (i) => (i.visible ? 'Yes' : 'No') }
      ]}
      fields={[
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'url', label: 'URL', type: 'text' },
        { name: 'description', label: 'One-line description', type: 'textarea' },
        { name: 'status', label: 'Status', type: 'select', options: ['live', 'beta', 'coming-soon'] },
        { name: 'order', label: 'Order', type: 'number' },
        { name: 'visible', label: 'Show on site', type: 'boolean' }
      ]}
    />
  );
}
