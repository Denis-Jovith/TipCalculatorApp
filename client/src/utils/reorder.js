import toast from 'react-hot-toast';
import { api } from '../api/client';

// Moves items[index] up/down (direction -1/+1) within the currently displayed list,
// then re-sequences everyone's `order` field to match so the new arrangement sticks —
// this works even when many items still share the same default order value (e.g. 0),
// where a plain swap of two numbers would otherwise be a no-op.
export async function reorderItem({ items, index, direction, endpoint, setItems, reload }) {
  const swapIndex = index + direction;
  if (swapIndex < 0 || swapIndex >= items.length) return;

  const next = [...items];
  const [moved] = next.splice(index, 1);
  next.splice(swapIndex, 0, moved);
  const resequenced = next.map((item, i) => ({ ...item, order: i }));

  setItems(resequenced);
  try {
    await Promise.all(resequenced.map((item) => api.put(`${endpoint}/${item._id}`, { order: item.order })));
  } catch {
    toast.error('Failed to reorder');
    reload();
  }
}
