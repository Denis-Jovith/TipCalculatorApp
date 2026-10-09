import GenericCrud from '../../components/admin/GenericCrud.jsx';

const CATEGORIES = [
  'Systems & Infrastructure',
  'Programming & Web',
  'Banking & Enterprise',
  'Networking',
  'Tools & Platforms',
  'Mobile & UI/UX',
  'Cybersecurity & Emerging Tech'
];

export default function AdminSkills() {
  return (
    <GenericCrud
      title="Skills"
      endpoint="/skills"
      emptyItem={{ name: '', category: CATEGORIES[0], level: 80, order: 0 }}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        { key: 'level', label: 'Level', render: (i) => `${i.level}%` }
      ]}
      fields={[
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'category', label: 'Category', type: 'select', options: CATEGORIES },
        { name: 'level', label: 'Level (0-100)', type: 'number', min: 0, max: 100 },
        { name: 'order', label: 'Order', type: 'number' }
      ]}
    />
  );
}
