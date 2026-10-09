import GenericCrud from '../../components/admin/GenericCrud.jsx';

export default function AdminExperience() {
  return (
    <GenericCrud
      title="Experience"
      endpoint="/experience"
      emptyItem={{ role: '', organization: '', location: '', startDate: '', endDate: 'Present', bullets: [], order: 0 }}
      columns={[
        { key: 'role', label: 'Role' },
        { key: 'organization', label: 'Organization' },
        { key: 'startDate', label: 'Start' },
        { key: 'endDate', label: 'End' }
      ]}
      fields={[
        { name: 'role', label: 'Role', type: 'text' },
        { name: 'organization', label: 'Organization', type: 'text' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'startDate', label: 'Start date', type: 'text' },
        { name: 'endDate', label: 'End date', type: 'text' },
        { name: 'bullets', label: 'Responsibilities / achievements', type: 'string-array' },
        { name: 'order', label: 'Order', type: 'number' }
      ]}
    />
  );
}
