import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

// Builds a router with public read access and admin-only write access for a simple Mongoose model.
export function crudRouter(Model, { sortBy = 'order title', publishedOnly = false } = {}) {
  const router = Router();

  router.get('/', async (req, res) => {
    const filter = publishedOnly && req.query.all !== 'true' ? { published: true } : {};
    const items = await Model.find(filter).sort(sortBy);
    res.json(items);
  });

  router.get('/:id', async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  });

  router.post('/', requireAuth, async (req, res) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json(item);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  router.put('/:id', requireAuth, async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  router.delete('/:id', requireAuth, async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  });

  return router;
}
