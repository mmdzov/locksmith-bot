import {
  Api,
  Bot,
  Context,
  MemorySessionStorage,
  RawApi,
  session,
  SessionFlavor,
} from "grammy";
import {
  BotType,
  SessionContext,
  ChannelSession,
  User as UserScheme,
} from "../global";
import keyboard from "./keyboard";
import fs from "fs";
import { Chat, ChatFromGetChat } from "@grammyjs/types";

let kb = keyboard.userKeyboard();
class User {
  constructor(
    private bot: Bot<Context & SessionFlavor<ChannelSession>, Api<RawApi>>,
    private creator: number
  ) {
    this.bot.use(
      session({
        initial(): ChannelSession {
          return { uid: 0, title: undefined };
        },
      })
    );
    this.bot.command("start", (ctx: Context) => {
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
      }
    });
    this.bot.on("channel_post", async (ctx: SessionContext) => {
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
                keyboard: kb.mainKeyboard.keyboard,
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
        `در ابتدا به منظور بررسی عضویت کاربر به کانال می بایست ربات ادمین کانال شود.
به محض ادمین کردن ربات کافی است در کانال /start را بزنید و بعد در همینجا برایتان اطلاعات کانالتان فرستاده خواهد شد
شما چت آیدی گروه را برای ربات می فرستید در نهایت قفل ربات شما ثبت خواهد شد`,
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
  private hasCreator(ctx: Context) {
    if (ctx.from?.id === this.creator) return true;
    return false;
  }
}

export default User;
