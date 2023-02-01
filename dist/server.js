import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import * as model from "./model.js";
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE"],
    credentials: true,
}));
app.get("/", (req, res) => {
    res.status(200).send(model.getApiInstructions());
});
app.get("/flashcards", (req, res) => {
    res.status(200).json(model.getFlashCards());
});
app.get("/welcomeMessage", (req, res) => {
    res.status(200).json(model.getWelcomeMessage());
});
app.post("/welcomeMessage", (req, res) => {
    const { message } = req.body;
    model.saveWelcomeMessage(message);
    res.status(200).json(message);
});
app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map