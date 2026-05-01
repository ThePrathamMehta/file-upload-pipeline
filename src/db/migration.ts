import { pool } from "./connection";
import path from "path";
import fs from "fs";

export const migrateDb = async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`
         CREATE TABLE IF NOT EXISTS _migrations (
           id SERIAL PRIMARY KEY,
           filename TEXT NOT NULL UNIQUE,
           run_at TIMESTAMP DEFAULT NOW()
         )
       `);
    const migrationsDir = path.join(__dirname, "./migrations");
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();
    for (const file of files) {
      // Check if this migration has already been run
      const { rows } = await client.query(
        "SELECT id FROM _migrations WHERE filename = $1",
        [file],
      );

      if (rows.length > 0) {
        console.log(`Skipping: ${file} (already run)`);
        continue;
      }

      // Run the migration
      console.log(`Running: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      await client.query(sql);

      // Mark it as done
      await client.query("INSERT INTO _migrations (filename) VALUES ($1)", [
        file,
      ]);

      console.log(`✓ Completed: ${file}`);
    }
    await client.query("COMMIT");
    console.log("migration completed Succesfully");
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

migrateDb();
