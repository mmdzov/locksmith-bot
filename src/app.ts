import { IToken } from "./../global.d";
import command from "./command";
import bot from "./config/bot";
import fs from "fs";
import { Bot } from "grammy";

//execute all commands
command.exec();

let datas = fs.readFileSync("src/data/tokens.json", "utf8");
let tokens: IToken[] = JSON.parse(datas);
tokens.forEach((item: IToken) => {
  let b = new Bot(item);
  b.on("message", (ctx) => {
    console.log(ctx.message?.text);
  });
  b.start();
});

bot.on("message", (ctx) => {
  console.log(ctx.message);
});

bot.start({ timeout: 10000, drop_pending_updates: true });
