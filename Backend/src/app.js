import cors from "cors";
import express from "express";

import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { requestLogger } from "./middleware/requestLogger.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(rateLimiter);

app.use("/api", routes);
app.use(errorHandler);

export default app;
