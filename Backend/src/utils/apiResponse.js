export function sendSuccess(res, { statusCode = 200, message = "Success", data = null, meta = null } = {}) {
  const payload = {
    success: true,
    message
  };

  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;

  return res.status(statusCode).json(payload);
}

export function sendError(res, { statusCode = 400, message = "Request failed", error = "BadRequest" } = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    error
  });
}

export function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
