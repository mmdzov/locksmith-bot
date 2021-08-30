import { ChannelType } from "./../global.d";
import {
  Api,
  Bot,
  Context,
  InlineKeyboard,
  RawApi,
  session,
  SessionFlavor,
} from "grammy";
import {
  SessionContext,
  ChannelSession,
  User as UserScheme,
  Sessions,
} from "../global";
import keyboard from "./keyboard";
import fs from "fs";
import { Chat } from "@grammyjs/types";

let kb = keyboard.userKeyboard();
class User {
  constructor(
    private bot: Bot<Context & SessionFlavor<Sessions>, Api<RawApi>>,
    private creator: number
  ) {
    this.bot.use(
      session({
        initial(): Partial<Sessions> {
          return {
            uid: 0,
            title: undefined,
            channels: undefined,
            failedJoin: 0,
          };
        },
      })
    );
    this.bot.command("start", async (ctx: SessionContext) => {
      if (ctx.from?.id === this.creator) {
        let newUser: UserScheme[] = [{ id: ctx.from?.id!, lock: [] }];
        try {
          let users: UserScheme[] = JSON.parse(
            fs.readFileSync("./data/users.json", "utf8")
          );
          let index: number = users.findIndex(
            (user: UserScheme) => user.id === ctx.from?.id
          );
          if (index === -1) {
            fs.writeFileSync("./data/users.json", JSON.stringify(newUser));
          }
        } catch (e: any) {
          if (e?.code === "ENOENT") {
            fs.writeFileSync("./data/users.json", JSON.stringify(newUser));
          }
        }
        ctx.api.sendMessage(
          ctx.from?.id,
          `کلید های مدیریت برای شما فعال است.`,
          {
            reply_markup: {
              keyboard: kb.mainKeyboard.keyboard,
              resize_keyboard: true,
            },
          }
        );
        return;
      }
      await this.hasChannelMember(ctx);
      if (ctx.session?.failedJoin > 0) {
        let ikb = new InlineKeyboard();
        let users: UserScheme[] = JSON.parse(
          fs.readFileSync("./data/users.json", "utf8")
        );
        let index = users.findIndex((item) => item.id === this.creator);
        users[index].lock?.map((l) => {
          ikb.url(`@${l?.username}`, `https://t.me/${l?.username}`).row();
        });
        ikb.text("عضو شدم", "Joined").row();
        ctx.reply(
          `سلام
    برای دسترسی باید ابتدا عضو این کانال ها بشی
          `,
          {
            reply_markup: {
              inline_keyboard: ikb.inline_keyboard,
              resize_keyboard: true,
            },
          }
        );
        ctx.session.channels = users[index]?.lock as ChannelType[];
        // ctx.session.failedJoin = 0;
      }
    });

    this.bot.on("channel_post", async (ctx: SessionContext) => {
      if (ctx.channelPost?.text !== "lock-channel") return;
      let b: Chat & {
        username?: string;
        title?: string;
      } = ctx.channelPost?.sender_chat!;
      ctx.getChatAdministrators().then((res) => {
        let users: UserScheme[] = JSON.parse(
          fs.readFileSync("./data/users.json", "utf8")
        );
        users.map((user) => {
          let r = res.filter((item) => user.id === item.user.id);
          if (r.length > 0) {
            r.map((item) => {
              ctx.deleteMessage().catch((e) => {});
              bot.api.sendMessage(
                item.user.id,
                "کانال جدید ثبت شد\n\n" +
                  "آیدی عددی کانال : " +
                  " `" +
                  Math.abs(b.id) +
                  "`\n\n" +
                  `آیدی کانال : @${b.username}

عنوان کانال : ${b.title}

آیدی عددی کانال را از همینجا کپی کرده و بفرستید تا قفل بر روی همین کانال فعال شود
`,
                { parse_mode: "Markdown" }
              );
            });
          }
        });
      });
    });
    this.bot.on("message", async (ctx: SessionContext, next) => {
      if (
        ctx.session.title === "ChannelSession" &&
        ctx.from?.id === this.creator
      ) {
        let users: UserScheme[] = JSON.parse(
          fs.readFileSync("./data/users.json", "utf8")
        );
        let index: number = users.findIndex(
          (user: UserScheme) => user.id === ctx.from?.id!
        );
        if (index >= 0) {
          let newbot: Chat & {
            username?: string;
            title?: string;
          } = await bot.api.getChat(-Math.abs(+(ctx.message?.text as string)));
          let usernameHasExist = await users[index].lock?.findIndex((item) => {
            return item?.id! === newbot.id;
          });
          if (usernameHasExist === -1) {
            users[index].lock?.push({
              id: newbot.id,
              username: newbot?.username!,
            });
            fs.writeFileSync("./data/users.json", JSON.stringify(users));
            ctx.reply(
              "قفل کانال جدید ثبت و افزوده شد.\n\n" +
                "آیدی عددی کانال : " +
                " `" +
                Math.abs(newbot.id) +
                "`\n\n" +
                `آیدی کانال : @${newbot.username}

عنوان کانال : ${newbot.title}

`,
              {
                parse_mode: "Markdown",
                reply_markup: {
                  keyboard: kb.mainKeyboard.keyboard,
                  resize_keyboard: true,
                },
              }
            );
          } else {
            ctx.reply("کانال قبلا ثبت شده.", {
              reply_markup: {
                keyboard: kb.channelKeyboard.keyboard,
                resize_keyboard: true,
              },
            });
          }
        }
        ctx.session.title = undefined;
        ctx.session.uid = 0;
      }
      return next();
    });
    this.bot.callbackQuery("Joined", async (ctx: SessionContext) => {
      let failedJoin = 0;
      let joinedCount = 0;
      for (
        let i = 0;
        (i < ctx.session.channels?.length!) as unknown as number;
        i++
      ) {
        let channelId = ctx.session.channels?.[i]?.id as number;
        let item = await this.bot.api.getChatMember(
          channelId,
          ctx.from?.id as number
        );
        if (item.status === "left") failedJoin++;
        else if (item.status === "kicked") failedJoin++;
        else if (item.status === "administrator") joinedCount++;
        else if (item.status === "member") joinedCount++;
      }
      if (failedJoin > 0) {
        ctx.reply(`باید در تمام کانال ها عضو شوید
درحال حاظر شما در ${
          (ctx.session.channels?.length! as unknown as number) - failedJoin
        } کانال عضو شدید.
        \n\n
         
        `);
      }
      if (joinedCount === ctx.session.channels?.length) {
        ctx.deleteMessage();
      }
    });
    this.bot.hears("قفل به کانال🔐", (ctx: Context) => {
      if (!this.hasCreator(ctx)) return;
      ctx.api.sendMessage(ctx.from?.id as number, `لطفا انتخاب کنید...`, {
        reply_markup: {
          keyboard: kb.channelKeyboard.keyboard,
          resize_keyboard: true,
        },
      });
    });
    this.bot.hears("بازگشت", (ctx: Context) => {
      if (!this.hasCreator(ctx)) return;
      ctx.api.sendMessage(ctx.from?.id as number, `لطفا انتخاب کنید...`, {
        reply_markup: {
          keyboard: kb.mainKeyboard.keyboard,
          resize_keyboard: true,
        },
      });
    });
    this.bot.hears("کانال جدید", (ctx: SessionContext) => {
      if (!this.hasCreator(ctx)) return;
      ctx.api.sendMessage(
        ctx.from?.id as number,
        `برای ثبت قفل کانال مراحل زیر را دنبال کنید:
        
1. رباتتان را به کانال مورد نظر ادد کنید و دسترسی ادمین کامل به او بدهید.

2. در کانال عبارت lock-channel را تایپ کنید و بفرستید ربات اطلاعات کانالتان را در همینجا ارسال می کند.

3. آیدی عددی کانالتان را کپی کنید و بفرستید.

درنهایت قفل کانال برای رباتتان فعال می شود.

`,
        {
          reply_markup: {
            keyboard: kb.cancelKeyboard.keyboard,
            resize_keyboard: true,
          },
        }
      );
      ctx.session.uid = ctx.from?.id!;
      ctx.session.title = "ChannelSession";
    });
  }
  private async hasChannelMember(ctx: SessionContext) {
    let users: UserScheme[] = JSON.parse(
      fs.readFileSync("./data/users.json", "utf8")
    );
    let index = users.findIndex((item) => item.id === this.creator);

    for (
      let i = 0;
      (i < users[index]?.lock?.length!) as unknown as number;
      i++
    ) {
      let channel = users[index].lock?.[i];
      let item = await this.bot.api.getChatMember(
        channel?.id!,
        ctx.from?.id as number
      );
      if (item.status === "left") ctx.session.failedJoin += 1;
      else if (item.status === "kicked") ctx.session.failedJoin += 1;
    }
  }
  private hasCreator(ctx: Context) {
    if (ctx.from?.id === this.creator) return true;
    return false;
  }
}

export default User;
