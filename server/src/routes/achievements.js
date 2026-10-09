import Achievement from '../models/Achievement.js';
import { crudRouter } from '../utils/crudFactory.js';

export default crudRouter(Achievement, { sortBy: 'order -date', publishedOnly: true });
