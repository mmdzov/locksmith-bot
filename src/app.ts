import { BotType, IToken } from "./../global.d";
import command from "./command";
import bot from "./config/bot";
import fs from "fs";
import { Bot } from "grammy";
import User from "./user";

//execute all commands
command.exec();

let datas = fs.readFileSync("./data/tokens.json", "utf8");

let tokens: IToken[] = JSON.parse(datas);
tokens.forEach((item: IToken) => {
  let b = new Bot<BotType>(item.TOKEN);
  new User(b, item.id as number);
  b;
  b.start({
    allowed_updates: [
      "channel_post",
      "message",
      "chat_member",
      "callback_query",
    ],
  });
});

bot.on("message", (ctx) => {
  console.log(ctx.message);
});

bot.start({
  timeout: 10000,
  drop_pending_updates: true,
});
