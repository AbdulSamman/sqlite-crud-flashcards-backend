import Database from "better-sqlite3";
import * as tools from "./tools.js";
import fs from "fs";
const dbAbsolutePathAndFileName = tools.absolutifyPathAndFileName("src/data/flashcards.sqlite");
const db = new Database(dbAbsolutePathAndFileName);
db.pragma(`journal_mode = WAL`);
const welcomeMessagePathFileName = "./src/data/welcomemessage.sqlite";
export const getFlashCards = () => {
    const stmt = db.prepare("SELECT * FROM flashcards");
    const flashCards = [];
    for (const flashCard of stmt.iterate()) {
        flashCards.push(flashCard);
    }
    return flashCards;
};
export const getWelcomeMessage = () => {
    const message = fs.readFileSync(welcomeMessagePathFileName, {
        flag: "r",
        encoding: "utf-8",
    });
    return message;
};
export const saveWelcomeMessage = (welcomeMessage) => {
    const saveMessage = fs.writeFileSync(welcomeMessagePathFileName, welcomeMessage);
    return saveMessage;
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
//# sourceMappingURL=model.js.map