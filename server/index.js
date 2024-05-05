import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connectDb, disconnectDb } from "./app/config/database.js";
import errorHandler from "./app/middleware/errorhandler.js";
import { logger } from "./app/middleware/logger.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors(
  {
    origin: true,
    credentials: true, // Allow credentials (cookies)
  }
));
app.use(logger);
// app.use(fileUpload());


// const limiter = rateLimit({
//   windowMs: 5 * 60 * 1000, // 15 minutes
//   limit: 100, // Limit each IP to x requests per `window` (here, per 15 minutes).
//   standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//   // store: ... , // Redis, Memcached, etc. See below.
//   message: 'درخواست تکراری بیش از حد!'+'\n' + 5 + ' دقیقه بعد مجدد تلاش کنید ',
//   statusCode: 408,
// })
// app.use(limiter)


// routes
import userRoute from "./app/routes/user.js";
import recordRoute from "./app/routes/record.js";
import adminRoute from "./app/routes/admin.js";

app.use('/user', userRoute);
app.use('/record', recordRoute);
app.use('/admin', adminRoute);

app.use(errorHandler)

connectDb(app);
