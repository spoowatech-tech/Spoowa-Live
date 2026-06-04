export function errorHandler(err, req, res, _next) {
  console.error('Unhandled error:', err.stack || err.message || err);

  const status = err.status || 500;
  const message = status === 500 && process.env.NODE_ENV !== 'development'
    ? 'Internal server error'
    : err.message || 'Internal server error';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
