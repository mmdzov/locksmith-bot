import dotenv from "dotenv";
import { Bot } from "grammy";
dotenv.config();

const bot = new Bot(process.env.TOKEN as string);

export default bot;
