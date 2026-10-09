import { crudRouter } from '../utils/crudFactory.js';
import QrDesign from '../models/QrDesign.js';

export default crudRouter(QrDesign, { sortBy: 'order' });
