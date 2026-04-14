import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(globalErrorHandler);
app.use(notFound);

// Routes
app.use('/api/v1', IndexRoutes);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the PH Health Care API!");
});

export default app;