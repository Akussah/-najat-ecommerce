import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

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

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not configured. Set it in .env or the environment.');
  process.exit(1);
}

const { Pool } = pg;
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin INTEGER DEFAULT 0');

  const { rows } = await client.query(
    'SELECT id, name, email, is_admin FROM users WHERE email = $1',
    [email]
  );

  const user = rows[0];
  if (!user) {
    console.error(`No user found for ${email}. Sign up first, then re-run.`);
    process.exit(1);
  }

  if (user.is_admin) {
    console.log(`${email} is already an admin.`);
    await client.query('ROLLBACK');
    process.exit(0);
  }

  await client.query('UPDATE users SET is_admin = 1 WHERE id = $1', [user.id]);
  await client.query('COMMIT');
  console.log(`Admin enabled for ${email}.`);
} catch (error) {
  await client.query('ROLLBACK');
  console.error('Failed to enable admin:', error.message || error);
  process.exit(1);
} finally {
  client.release();
  await pool.end();
}
