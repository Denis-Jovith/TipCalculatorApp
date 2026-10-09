import Project from '../models/Project.js';
import { crudRouter } from '../utils/crudFactory.js';

const router = crudRouter(Project, { sortBy: '-featured order -createdAt', publishedOnly: true });

export default router;
