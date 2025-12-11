import { createClient } from "@libsql/client";

export default async function handler(event, context) {
  const db = createClient({
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_DB_TOKEN,
  });

  const method = event.httpMethod;

  try {
    if (method === "GET") {
      const rows = await db.execute("SELECT * FROM prices");
      return {
        statusCode: 200,
        body: JSON.stringify(rows.rows)
      };
    }

    if (method === "PUT") {
      const body = JSON.parse(event.body);
      await db.execute({
        sql: "UPDATE prices SET price=? WHERE id=?",
        args: [body.price, body.id]
      });

      return { statusCode: 200, body: "OK" };
    }

    return { statusCode: 405, body: "Method Not Allowed" };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
