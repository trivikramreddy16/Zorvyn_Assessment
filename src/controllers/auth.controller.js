import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import pool from "../db/db-connection.js";
import bcrypt from "bcrypt";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All the fields are required");
  }

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (rows.length > 0) {
    throw new ApiError(409, "User already exists...");
  }

  const hashedPassword = bcrypt.hash(password, 10);

  const [user] = await pool.query(
    "INSERT INTO users (name,email,password) VALUES (?,?,?)",
    [name, email, hashedPassword],
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { id: user.insertId },
        " user registered successfully",
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Both Email and Password is required!!");
  }

  const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (user.length == 0) {
    throw new ApiError(409, "User Doesn't exist. Please Register First!!");
  }

  const storedHashed = await pool.query(
    "SELECT password FROM users WHERE email = ?",
    [email],
  );
  const isPasswordValid = bcrypt.compare(password, storedHashed);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials");
  }
});

export { registerUser };
