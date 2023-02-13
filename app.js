import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import compression from "compression";
import cookieParser from "cookie-parser";

dotenv.config();

import morganLogger from "./utils/morganLogger.js";
import winstonLogger from "./utils/winstonLogger.js";

import connectDB from "./config/db.js";

import { errorHandler, notFound } from "./mvc/middlewares/errorMiddlewares.js";
import corsOptions from "./config/corsOptions.js";

import authRoutes from "./mvc/routers/authRouters.js";

const app = express();

// Logger Middlewares (Winston and Morgan)
app.use(morganLogger);

// Middlewares

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

app.use(express.urlencoded({ extended: true }));

// Set Security HTTP Headers
app.use(helmet());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

app.use(cors(corsOptions));

app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

// Compress response bodies for all request that traverse through the middleware
app.use(compression());

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

// Database Connection
connectDB();

/// Cookie Parser
app.use(cookieParser());

/// Limiting requests from the same IP.
app.use("/", limiter);

// V1 API Routes
app.get("/api/v1/status", (req, res) => {
  winstonLogger.info("Checking the API status: Everything is OK");
  res.status(200).send({
    status: "UP",
    message: "The API is up and running!",
  });
});

/// Auth Routes
app.use("/api/v1/auth", authRoutes);

// Render client React app
app.use(express.static("client/dist"));

// Error Handling Middleware
app.use(notFound);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  winstonLogger.info(
    `Home Interview app listening on port ${process.env.PORT}!`
  );
});

export default app;
