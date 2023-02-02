import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as model from "./model.js";
import * as config from "./config.js";
dotenv.config();

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE"],
    credentials: true,
  })
);
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  })
);

const authorizeUser = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.session.user === ("admin" as any)) {
    next();
  } else {
    res.status(401).send({});
  }
};

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(model.getApiInstructions());
});

app.get("/flashcards", (req: express.Request, res: express.Response) => {
  res.status(200).json(model.getFlashCards());
});

app.get("/flashcards/:id", (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  res.status(200).json(model.getFlashCard(id));
});

app.get("/welcomeMessage", (req: express.Request, res: express.Response) => {
  res.status(200).json(model.getWelcomeMessage());
});

app.post(
  "/welcomeMessage",
  authorizeUser,
  (req: express.Request, res: express.Response) => {
    const { message } = req.body;
    model.saveWelcomeMessage(message);
    res.status(200).json(message);
  }
);
app.post("/login", (req: express.Request, res: express.Response) => {
  const password = req.body.password;
  if (password === process.env.ADMIN_PASSWORD) {
    req.session.user = "admin" as any;
    req.session.cookie.expires = new Date(
      Date.now() + config.secondsTillTimeout * 1000
    );
    req.session.save();
    res.status(200).send("ok");
  } else {
    res.status(401).send({});
  }
});
app.get("/currentUser", (req: express.Request, res: express.Response) => {
  if (req.session.user) {
    res.send(req.session.user);
  } else {
    res.status(403).send({});
  }
});

app.get("/logout", (req: express.Request, res: express.Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send("logged out");
    }
  });
});

app.delete(
  "/flashcards/:id",
  authorizeUser,
  (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    res.status(200).json(model.deleteFlashcard(id));
  }
);

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
