import { pool } from "./connection";
import path from "path";
import fs from "fs";

export const migrateDb = async () => {
  const client = await pool.connect();
  try {
    const schemaFile = fs.readFileSync(
      path.join(__dirname, "../../", "schema.sql"),
      "utf-8",
    );
    await client.query("BEGIN");
    await client.query(schemaFile);
    await client.query("END");
    console.log("migration completed Succesfully");
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

migrateDb();