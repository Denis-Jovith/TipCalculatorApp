import GenericCrud from '../../components/admin/GenericCrud.jsx';

export default function AdminEducation() {
  return (
    <GenericCrud
      title="Education"
      endpoint="/education"
      emptyItem={{ degree: '', school: '', period: '', details: '', order: 0 }}
      columns={[
        { key: 'degree', label: 'Degree' },
        { key: 'school', label: 'School' },
        { key: 'period', label: 'Period' }
      ]}
      fields={[
        { name: 'degree', label: 'Degree / Certificate', type: 'text' },
        { name: 'school', label: 'School', type: 'text' },
        { name: 'period', label: 'Period', type: 'text' },
        { name: 'details', label: 'Details', type: 'text' },
        { name: 'order', label: 'Order', type: 'number' }
      ]}
    />
  );
}
