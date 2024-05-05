import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // minutes
  limit: 10, // Limit each IP to x requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
  message: 'درخواست تکراری بیش از حد!'+'\n' + 5 + ' دقیقه بعد مجدد تلاش کنید ',
  statusCode: 408,
});

export default limiter;