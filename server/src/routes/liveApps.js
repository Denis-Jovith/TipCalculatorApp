import LiveApp from '../models/LiveApp.js';
import { crudRouter } from '../utils/crudFactory.js';

export default crudRouter(LiveApp, { sortBy: 'order' });
