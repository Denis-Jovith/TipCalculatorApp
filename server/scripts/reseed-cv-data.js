import 'dotenv/config';
import { connectDB } from '../src/config/db.js';
import Skill from '../src/models/Skill.js';
import Experience from '../src/models/Experience.js';
import Education from '../src/models/Education.js';
import { skills, experience, education } from '../src/utils/seed.js';

await connectDB();

await Skill.deleteMany({});
await Skill.insertMany(skills);
console.log('Replaced skills: ' + skills.length + ' inserted');

await Experience.deleteMany({});
await Experience.insertMany(experience);
console.log('Replaced experience: ' + experience.length + ' inserted');

await Education.deleteMany({});
await Education.insertMany(education);
console.log('Replaced education: ' + education.length + ' inserted');

console.log('Done.');
process.exit(0);
