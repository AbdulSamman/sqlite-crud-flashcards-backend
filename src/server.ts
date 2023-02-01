import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as model from "./model.js";
import { fstat } from "fs";
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(model.getApiInstructions());
});

app.get("/flashcards", (req: express.Request, res: express.Response) => {
  res.status(200).json(model.getFlashCards());
});

app.get("/welcomeMessage", (req: express.Request, res: express.Response) => {
  res.status(200).json(model.getWelcomeMessage());
});

app.post("/welcomeMessage", (req: express.Request, res: express.Response) => {
  const { message } = req.body;
  model.saveWelcomeMessage(message);
  res.status(200).json(message);
});

app.delete("/flashcards/:id", (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  res.status(200).json(model.deleteFlashcard(id));
});

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
