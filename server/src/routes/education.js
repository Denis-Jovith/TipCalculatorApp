import Education from '../models/Education.js';
import { crudRouter } from '../utils/crudFactory.js';

export default crudRouter(Education, { sortBy: 'order' });
