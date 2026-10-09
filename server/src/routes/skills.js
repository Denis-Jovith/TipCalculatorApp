import Skill from '../models/Skill.js';
import { crudRouter } from '../utils/crudFactory.js';

export default crudRouter(Skill, { sortBy: 'category order' });
