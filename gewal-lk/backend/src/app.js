import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { environment } from "./config/environment.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { apiRateLimiter } from "./middlewares/rateLimit.middleware.js";
import apiRoutes from "./routes/index.js";

const app = express();

app.disable("x-powered-by");

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(
  cors({
    origin: environment.frontendUrl,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],
  })
);

app.use(compression());

app.use(cookieParser(environment.cookieSecret));

app.use(
  express.json({
    limit: "2mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

if (environment.isDevelopment) {
  app.use(morgan("dev"));
}

app.use("/api", apiRateLimiter);

app.use(
  `/api/${environment.apiVersion}`,
  apiRoutes
);

app.get("/", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Welcome to the Gewal.lk API",
    documentation: `/api/${environment.apiVersion}`,
  });
});

app.use(notFoundHandler);

app.use(globalErrorHandler);

export default app;