import { query } from './config/db.js';
const res = query('SELECT COUNT(*) as count FROM questions WHERE role = "Developer" AND level = "Beginner"');
console.log('Developer Beginner count:', res.rows[0].count);
const all = query('SELECT DISTINCT role, level FROM questions');
console.log('All roles/levels:', all.rows);
process.exit(0);
