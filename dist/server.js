import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as model from "./model.js";
import * as config from "./config.js";
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE"],
    credentials: true,
}));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    },
}));
const authorizeUser = (req, res, next) => {
    if (req.session.user === "admin") {
        next();
    }
    else {
        res.status(401).send({});
    }
};
app.get("/", (req, res) => {
    res.status(200).send(model.getApiInstructions());
});
app.get("/flashcards", (req, res) => {
    res.status(200).json(model.getFlashCards());
});
app.get("/welcomeMessage", (req, res) => {
    res.status(200).json(model.getWelcomeMessage());
});
app.post("/welcomeMessage", authorizeUser, (req, res) => {
    const { message } = req.body;
    model.saveWelcomeMessage(message);
    res.status(200).json(message);
});
app.post("/login", (req, res) => {
    const password = req.body.password;
    if (password === process.env.ADMIN_PASSWORD) {
        req.session.user = "admin";
        req.session.cookie.expires = new Date(Date.now() + config.secondsTillTimeout * 1000);
        req.session.save();
        res.status(200).send("ok");
    }
    else {
        res.status(200).send({});
    }
});
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send("logged out");
        }
    });
});
app.delete("/flashcards/:id", authorizeUser, (req, res) => {
    const { id } = req.params;
    res.status(200).json(model.deleteFlashcard(id));
});
app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map