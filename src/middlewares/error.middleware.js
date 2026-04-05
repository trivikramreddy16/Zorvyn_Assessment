import { ApiError } from "../utils/api-error.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  return res.stack(error.statusCode).json({
    succuess: false,
    message: error.message,
    errors: error.errors,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

export { errorHandler };
