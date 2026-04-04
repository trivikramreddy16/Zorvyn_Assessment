import app from "./app.js";
import pool from "./db/db-connection.js";

const port = process.env.PORT || 8000;

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  }

  console.log("Database connected");

  connection.release();

  app.listen(port, () => {
    console.log(`App is listening at port: ${port}`);
  });
});
