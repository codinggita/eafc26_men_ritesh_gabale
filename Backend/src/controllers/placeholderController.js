export function routeNotImplemented(req, res) {
  res.status(200).json({
    message: "Route registered successfully",
    method: req.method,
    path: req.originalUrl
  });
}

