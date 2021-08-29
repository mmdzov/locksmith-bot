import {
  Api,
  Bot,
  Context,
  MemorySessionStorage,
  RawApi,
  session,
  SessionFlavor,
} from "grammy";
import { BotType, SessionContext, setChannel } from "../global";
import keyboard from "./keyboard";

let kb = keyboard.userKeyboard();
class User {
  constructor(
    private bot: Bot<Context & SessionFlavor<setChannel>, Api<RawApi>>,
    private creator: number
  ) {
    this.bot.use(
      session({
        initial(): setChannel {
          return { uid: 0 };
        },
      })
    );
    this.bot.command("start", (ctx: Context) => {
      if (ctx.from?.id === this.creator) {
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
      console.log(ctx.session.uid);
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
      ctx.session.uid = 10
    });
  }
  private hasCreator(ctx: Context) {
    if (ctx.from?.id === this.creator) return true;
    return false;
  }
}

export default User;
