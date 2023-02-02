import Database from "better-sqlite3";
import { IFlashcard } from "./interfaces.js";
import * as tools from "./tools.js";
import fs from "fs";

const dbAbsolutePathAndFileName = tools.absolutifyPathAndFileName(
  "src/data/flashcards.sqlite"
);
// db from better-sqlite
const db = new Database(dbAbsolutePathAndFileName);
// verschiedene users gleichzeitig benutzen können
db.pragma(`journal_mode = WAL`);

const welcomeMessagePathFileName = "./src/data/welcomemessage.sqlite";

export const getFlashCards = (): IFlashcard[] => {
  const stmt = db.prepare("SELECT * FROM flashcards");
  const flashCards: IFlashcard[] = [];
  for (const flashCard of stmt.iterate()) {
    flashCards.push(flashCard);
  }

  return flashCards;
};

export const getFlashCard = (id: string) => {
  try {
    const stmt = db.prepare("SELECT * FROM flashcards WHERE id=?");
    const result = stmt.get(id);
    if (result === undefined) {
      return result;
    } else {
      const flashCard: IFlashcard = {
        ...result,
      };
      return flashCard;
    }
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
};

export const getWelcomeMessage = () => {
  const message = fs.readFileSync(welcomeMessagePathFileName, {
    flag: "r",
    encoding: "utf-8",
  });
  return message;
};

export const saveWelcomeMessage = (welcomeMessage: string) => {
  const saveMessage = fs.writeFileSync(
    welcomeMessagePathFileName,
    welcomeMessage
  );
  return saveMessage;
};

export const deleteFlashcard = (id: string) => {
  try {
    const stmt = db.prepare("DELETE FROM flashcards WHERE id=?");
    const result = stmt.run(id);
    return result;
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
};

export const getApiInstructions = () => {
  return `
    
    <style>
    body{
        background-color: #333;
        color:#eee;
        padding: 1rem;
        font-family: courier;
    }
    h1{
        color: gold
    }
    a {
		background-color: #222;
		color: yellow;
	}
    </style>
    <h1>SQLite Site API</h1>
    <ul>
	<li><a href="/flashcards">/flashcards</a> - all flashcards</li>
  <li><a href="/welcomemessage">/welcomemessage</a> - Welcome Message</li>
</ul>
    `;
};
