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
    this.bot.on("message::mention", (ctx: SessionContext) => {
      console.log(ctx.session.title);
      if (
        ctx.session.title === "ChannelSession" &&
        ctx.from?.id === this.creator
      ) {
        console.log("ok");
        let users = fs.readFileSync("./data/users.json", "utf8"); //! find user and add new lock channel
        // ctx.session.title = undefined;
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
        `در ابتدا به منظور بررسی عضویت کاربر به کانال می بایست ربات ادمین کانال شود و در قدم بعد آیدی کانال را بفرستید تا ثبت شود`,
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
