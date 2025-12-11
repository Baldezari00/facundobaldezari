import { createClient } from "@libsql/client";

export default async function handler(event, context) {
  const db = createClient({
    url: process.env.TURSO_DB_URL,
    authToken: process.env.TURSO_DB_TOKEN,
  });

  const method = event.httpMethod;

  try {
    if (method === "GET") {
      const rows = await db.execute("SELECT * FROM services");
      return {
        statusCode: 200,
        body: JSON.stringify(rows.rows)
      };
    }

    if (method === "POST") {
      const body = JSON.parse(event.body);
      await db.execute({
        sql: "INSERT INTO services (title, description, price) VALUES (?, ?, ?)",
        args: [body.title, body.description, body.price]
      });

      return { statusCode: 200, body: "OK" };
    }

    if (method === "PUT") {
      const body = JSON.parse(event.body);
      await db.execute({
        sql: "UPDATE services SET title=?, description=?, price=? WHERE id=?",
        args: [body.title, body.description, body.price, body.id]
      });

      return { statusCode: 200, body: "OK" };
    }

    if (method === "DELETE") {
      const id = event.queryStringParameters.id;
      await db.execute({
        sql: "DELETE FROM services WHERE id=?",
        args: [id]
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
