import Experience from '../models/Experience.js';
import { crudRouter } from '../utils/crudFactory.js';

export default crudRouter(Experience, { sortBy: 'order -startDate' });
