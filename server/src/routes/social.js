import SocialLink from '../models/SocialLink.js';
import { crudRouter } from '../utils/crudFactory.js';

export default crudRouter(SocialLink, { sortBy: 'order' });
