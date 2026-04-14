import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";

const app: Application = express();


// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the PH Health Care API!");
});

app.post('/test', async (req: Request, res: Response) => {
  const speciality = await prisma.speciality.create({
    data: {
      title: "shfh",
      description: "Sample description",
      icon: "sample-icon"
    }
  });
  return res.status(201).json(speciality);
});

export default app;