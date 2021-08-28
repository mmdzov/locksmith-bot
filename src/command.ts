import { Context } from "grammy";
import bot from "./config/bot";

class Commands {
  private start() {
    bot.command("start", (ctx: Context) => {
      ctx.reply(`سلام ${ctx.message?.from?.first_name} به قفل ساز کانال و گروه خوش اومدی.
می خوای ربات قفل خودتو داشته باشی؟
خب روی /newbot بزن تا بهت بگم چیکار کنی
              `);
    });
  }
  private newbot() {
    bot.command("newbot", (ctx: Context) => {
      console.log(ctx.message);
    });
  }
  exec() {
    this.start();
    this.newbot();
  }
}

export default new Commands();
