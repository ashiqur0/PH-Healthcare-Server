import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
// import AppError from "./app/errorHelpers/appError";
// import status from "http-status";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/v1', IndexRoutes);

// Basic route
app.get("/", (req: Request, res: Response) => {
  // throw new AppError(status.BAD_REQUEST, "Ami App Error!"); // Example error to test global error handler
  res.send("Welcome to the PH Health Care API!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;