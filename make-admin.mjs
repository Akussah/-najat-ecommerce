import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

const getFlagValue = (flag) => {
  const index = args.indexOf(flag);
  if (index !== -1) return args[index + 1] || '';
  const withEquals = args.find((arg) => arg.startsWith(`${flag}=`));
  if (withEquals) return withEquals.slice(flag.length + 1);
  return '';
};

const emailArg =
  getFlagValue('--email') ||
  getFlagValue('-e') ||
  args.find((arg) => !arg.startsWith('-')) ||
  '';

const email = String(emailArg || '').trim().toLowerCase();

if (!email) {
  console.log('Usage: node make-admin.mjs user@example.com');
  console.log('   or: node make-admin.mjs --email user@example.com');
  process.exit(1);
}

const dbPath = path.join(__dirname, 'backend', 'data', 'app.db');

if (!existsSync(dbPath)) {
  console.error(
    `Database not found at ${dbPath}. Start the API once (npm run api) to initialize it.`
  );
  process.exit(1);
}

const db = new Database(dbPath);

try {
  // Safely ensure the is_admin column exists before querying
  try {
    db.prepare('ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0').run();
  } catch (error) {
    if (!/duplicate column/i.test(String(error.message || ''))) {
      // ignore other errors
    }
  }

  const user = db.prepare('SELECT id, name, email, is_admin FROM users WHERE email = ?').get(email);
  if (!user) {
    console.error(`No user found for ${email}. Sign up first, then re-run.`);
    process.exit(1);
  }

  if (user.is_admin) {
    console.log(`${email} is already an admin.`);
    process.exit(0);
  }

  db.prepare('UPDATE users SET is_admin = 1 WHERE id = ?').run(user.id);
  console.log(`Admin enabled for ${email}.`);
} finally {
  db.close();
}
