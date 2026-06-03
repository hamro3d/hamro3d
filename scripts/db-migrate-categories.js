import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Parse .env manually to avoid dependency issues
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] ? match[2].trim() : '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[match[1]] = value;
    }
  });
  return env;
}

async function main() {
  const env = loadEnv();
  const dbHost = env.NUXT_DB_HOST || '127.0.0.1';
  const dbPort = Number(env.NUXT_DB_PORT || '3306');
  const dbUser = env.NUXT_DB_USER || 'root';
  const dbPassword = env.NUXT_DB_PASSWORD || '';
  const dbName = env.NUXT_DB_NAME || 'hamro3d';

  console.log(`Connecting to database ${dbName} on ${dbHost}:${dbPort}...`);
  const connection = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName
  });

  try {
    // 1. Check if collections table exists
    const [tables] = await connection.query(`SHOW TABLES LIKE 'collections'`);
    if (tables.length > 0) {
      console.log('Renaming table "collections" to "categories"...');
      // Before renaming, drop the foreign key constraint on products to avoid errors
      try {
        console.log('Checking foreign key constraints on products...');
        // Drop constraint if it exists. In our db-init, the foreign key was added implicitly or explicitly.
        // Let's drop foreign key and then rename the table.
        // To find the constraint name, we can query information_schema or just try standard names.
        // Usually, in MySQL, the constraint name might be products_ibfk_1 or similar.
        // Let's check table status or use ALTER TABLE DROP FOREIGN KEY.
        // A safer way is to find it via query.
        const [constraints] = await connection.query(`
          SELECT CONSTRAINT_NAME 
          FROM information_schema.KEY_COLUMN_USAGE 
          WHERE TABLE_NAME = 'products' 
            AND COLUMN_NAME = 'collection_id' 
            AND REFERENCED_TABLE_NAME = 'collections'
            AND TABLE_SCHEMA = ?
        `, [dbName]);

        for (const row of constraints) {
          console.log(`Dropping foreign key constraint: ${row.CONSTRAINT_NAME}`);
          await connection.query(`ALTER TABLE products DROP FOREIGN KEY ${row.CONSTRAINT_NAME}`);
        }
      } catch (err) {
        console.warn('Warning: Could not drop foreign key constraint (might not exist):', err.message);
      }

      await connection.query('RENAME TABLE collections TO categories');
      console.log('Table renamed successfully.');
    } else {
      console.log('Table "collections" already renamed or does not exist.');
    }

    // 2. Check if product table has collection_id column
    const [columns] = await connection.query(`SHOW COLUMNS FROM products LIKE 'collection_id'`);
    if (columns.length > 0) {
      console.log('Renaming column "collection_id" to "category_id" in products...');
      await connection.query('ALTER TABLE products CHANGE COLUMN collection_id category_id INT NULL');
      console.log('Column renamed successfully.');
    } else {
      console.log('Column "collection_id" already renamed or does not exist.');
    }

    // 3. Add the foreign key constraint pointing to categories
    try {
      console.log('Adding new foreign key constraint category_id -> categories(id)...');
      await connection.query(`
        ALTER TABLE products 
        ADD CONSTRAINT fk_products_category 
        FOREIGN KEY (category_id) REFERENCES categories(id) 
        ON DELETE SET NULL
      `);
      console.log('Foreign key constraint added successfully.');
    } catch (err) {
      // If constraint already exists, ignore
      if (err.code === 'ER_DUP_KEYNAME' || err.message.includes('Duplicate key name') || err.message.includes('already exists')) {
        console.log('Foreign key constraint already exists.');
      } else {
        throw err;
      }
    }

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

main();
