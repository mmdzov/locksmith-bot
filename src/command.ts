import { IToken } from "./../global.d";
import { Api, Context } from "grammy";
import bot from "./config/bot";
import express from "express";
import { Bot } from "grammy";
import fs from "fs";
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
    bot.command("newbot", async (ctx: Context) => {
      if (ctx.message?.text?.trim() !== "/newbot") {
        const TOKEN = ctx.message?.text
          ?.trim()
          .split("/newbot-")
          .filter((_, index) => index !== 0)
          .join("");
        let datas = fs.readFileSync("src/data/tokens.json", "utf8");
        let tokens: IToken[] = JSON.parse(datas);
        let index: number = tokens.findIndex(
          (token: IToken) => token === TOKEN
        );
        if (index === -1) {
          tokens.push(TOKEN!);
          let b = new Bot(TOKEN as string);
          await b.init();
          fs.writeFileSync("src/data/tokens.json", JSON.stringify(tokens));
          b.start();
          bot.api.sendMessage(
            ctx.from?.id as number,
            `ربات شما با آیدی @${b.botInfo.username} با موفقیت ساخته شد واردش شوید و /start بزنید.`
          );
        } else {
          // ctx.reply(`ربات شما قبلا ایجاد شده.`);
        }
        // b.api
        //   .setWebhook(`https://api.telegram.org/bot${TOKEN}/setwebhook`)
        //   .then((res) => {
        //     console.log(res);
        //     if (res) {
        //     }
        //   });
        // let b = new Api(process.env.TOKEN as string);
        // b.setWebhook(`https://api.telegram.org/bot${TOKEN}/setwebhook`).then(
        //   (res) => {
        //     console.log(res);
        //   }
        // );
        // b.getUpdates().then((res) => {
        //   console.log(res);
        // });

        return;
      }
      ctx.reply(`‍‍خب دوست من حالا توکن رباتت رو با دستور /newbot-TOKEN بفرست تا برات فعالش کنم.
برای دریافت توکن اول باید به @botfather مراجعه کنی.
بعد روی /newbot میزنی.
در ابتدا نام رباتت رو وارد میکن.
در قدم بعد ازت میخواد که آیدی رباتت رو وارد کنی.
آیدی ربات نباید تکراری باشه و در انتها باید عنوان bot حتما ذکر شده باشه مانند Locksmithchannelbot و یادت باشه اون آیدی که میخوای برای رباتت درنظر بگیریو بدون @ براش بفرستی.
حالا رباتت آمادس و باید توکنی بهت بده مثل این
1804787525:AAHuvQIKdGph5YX1RQo_1fQuryGWZfJl6aI
اون رو کپی می کنی و همینجا برام می فرستی اگه بهت توکن رو نداد حتما ازت میخواد که آیدی دیگری برای رباتت درنظر بگیری و آیدی ای که براش فرستادی قبلا استفاده شده.

نمونه توکن ارسالی شما باید مانند نمونه زیر باشد:
/newbot-1804787525:AAHuvQIKdGph5YX1RQo_1fQuryGWZfJl6aI
`);
    });
  }
  exec() {
    this.start();
    this.newbot();
  }
}

export default new Commands();
