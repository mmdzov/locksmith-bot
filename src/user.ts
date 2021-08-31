import {
  ChannelType,
  UploadContent,
  UploadFileScheme,
  UploadTypeAllows,
} from "./../global.d";
import {
  Api,
  Bot,
  Context,
  InlineKeyboard,
  InputFile,
  NextFunction,
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
import { Chat, ChatFromGetChat, Message } from "@grammyjs/types";
import { nanoid } from "nanoid";
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
            uploadType: undefined, //! default undefined
            uploadDataSession: undefined,
            deleteChannel: false,
            refId: undefined,
          };
        },
      })
    );
    this.bot.command("start", async (ctx: SessionContext) => {
      if (ctx.match?.includes("ref")) {
        ctx.session.refId = ctx.match! as string;
        if (this.creator === ctx.from?.id) {
          this.getReferralContent(ctx);
        }
      }
      if (ctx.from?.id === this.creator) {
        let newUser: UserScheme[] = [
          { id: ctx.from?.id!, lock: [], posts: [] },
        ];
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
      } else {
        this.getReferralContent(ctx);
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
      let hasUpload: boolean = this.uploadData(ctx);
      this.deleteChannel(ctx);
      if (hasUpload) return next();
      if (
        ctx.session.title === "ChannelSession" &&
        ctx.from?.id === this.creator &&
        !kb.keys.includes("بازگشت🔙")
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
    this.bot.hears("مشاهده 👁‍🗨", async (ctx: Context, next) => {
      if (ctx.from?.id! !== this.creator) return;
      let users: UserScheme[] = await JSON.parse(
        fs.readFileSync("./data/users.json", "utf8")
      );
      let index = await users.findIndex((user) => user.id === ctx.from?.id!);
      if (index === -1) {
        ctx.reply(`هنوز کانالی ثبت نکردید.`);
        return;
      }
      let lockList: ChannelType[] = users[index]?.lock! as ChannelType[];
      type ChannelChatType = ChatFromGetChat &
        Partial<{ title?: string; username?: string; invite_link: string }>;
      let channel: ChannelChatType;
      let channels: string[] = [];
      for (let x in lockList) {
        channel = await this.bot.api.getChat(lockList[x].id);
        channels.push(`نام کانال : ${channel.title}

یوزرنیم : @${channel.username}

آیدی عددی : ${Math.abs(channel.id)}

لینک کانال : 
${channel.invite_link}

        `);
      }
      ctx.reply(`${channels.join("\n------------\n\n")}`);
      return next();
    });
    this.bot.hears("حذف❌", (ctx: SessionContext, next) => {
      ctx.reply(
        `یوزرنیم یا آیدی عددی کانال را بفرستید
توجه داشته باشید یوزرنیم را با @ ارسال کنید`,
        {
          reply_markup: {
            keyboard: kb.cancelKeyboard.keyboard,
            resize_keyboard: true,
          },
        }
      );
      ctx.session.deleteChannel = true;
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
        this.getReferralContent(ctx, ctx.session.refId);
      }
    });
    this.bot.hears("مدیریت قفل🔐", (ctx: Context, next) => {
      if (!this.hasCreator(ctx)) return;
      ctx.api.sendMessage(ctx.from?.id as number, `لطفا انتخاب کنید...`, {
        reply_markup: {
          keyboard: kb.channelKeyboard.keyboard,
          resize_keyboard: true,
        },
      });
      return next();
    });
    this.bot.hears("آپلود🗳", (ctx: SessionContext, next) => {
      ctx.reply(
        `محتوایی که می خواهید در ربات قفل بماند را ارسال کنید تا آپلود شود.

می تواند شامل : ویس / تصویر / ویدیو / فایل / متن / موسیقی، باشد.`,
        {
          reply_markup: {
            keyboard: kb.uploadKeyboard.keyboard,
            resize_keyboard: true,
          },
        }
      );
      ctx.session.uploadType = "upload";
      return next();
    });
    this.bot.hears("آپلود محتوا🗂", async (ctx: SessionContext, next) => {
      if (typeof ctx.session.uploadDataSession === "undefined") {
        ctx.reply(`شما هنوز محتوایی ارسال نکردید.`);
        return;
      }
      let users: UserScheme[] = JSON.parse(
        fs.readFileSync("./data/users.json", "utf8")
      );
      let index = users.findIndex((user) => user.id === this.creator);
      users[index].posts.push(ctx.session.uploadDataSession);
      await fs.writeFileSync("./data/users.json", JSON.stringify(users));
      const refUrl = `https://t.me/${this.bot.botInfo.username}?start=ref_${this.creator}_${ctx.session.uploadDataSession.referral_link}`;
      ctx.reply(
        `محتوا آپلود شد.
لینک محتوا: 
${refUrl}`,
        {
          reply_markup: {
            keyboard: kb.mainKeyboard.keyboard,
            resize_keyboard: true,
          },
        }
      );
      ctx.session.uploadDataSession = undefined;
      ctx.session.uploadType = undefined;
      return next();
    });

    //! back
    this.bot.hears("بازگشت🔙", (ctx: SessionContext, next) => {
      if (!this.hasCreator(ctx)) return;
      ctx.session.uploadDataSession = undefined;
      ctx.session.uploadType = undefined;
      if (ctx.session.deleteChannel || ctx.session.title === "ChannelSession") {
        ctx.api.sendMessage(ctx.from?.id as number, `لطفا انتخاب کنید...`, {
          reply_markup: {
            keyboard: kb.channelKeyboard.keyboard,
            resize_keyboard: true,
          },
        });
        ctx.session.deleteChannel = false;
        ctx.session.title = undefined;
        ctx.session.uid = 0;
        return;
      }
      ctx.api.sendMessage(ctx.from?.id as number, `لطفا انتخاب کنید...`, {
        reply_markup: {
          keyboard: kb.mainKeyboard.keyboard,
          resize_keyboard: true,
        },
      });
      return next();
    });
    this.bot.hears("افزودن📌", (ctx: SessionContext, next) => {
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
      return next();
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
  private uploadData(ctx: SessionContext): boolean {
    if (ctx.from?.id !== this.creator) return false;
    if (
      ctx.session.uploadType === "upload" &&
      ctx.message?.text !== "آپلود محتوا🗂" &&
      ctx.message?.text !== "بازگشت🔙"
    ) {
      let data: Partial<UploadContent> = {
        author_id: ctx.from?.id,
        referral_link: nanoid(10),
        text: ctx.message?.text ?? ctx.message?.caption,
        views: 0,
      };
      let fileTypes: UploadTypeAllows[] = [
        "photo",
        "audio",
        "voice",
        "video",
        "document",
        "text",
      ];
      for (let i = 0; i < fileTypes.length; i++) {
        let selectType = ctx?.message?.[fileTypes[i]];
        if (selectType instanceof Array) {
          if (selectType.length > 0) {
            console.log(selectType);
            data.file = selectType[selectType.length - 1];
            data.type = fileTypes[i];
            break;
          }
        } else if (selectType instanceof Object) {
          if (Object.keys(selectType).length > 0) {
            data.file = selectType;
            data.type = fileTypes[i];
            break;
          }
        } else if (typeof selectType === "string" && selectType.length > 0) {
          data.type = "text";
        }
      }
      ctx.session.uploadDataSession = data;
      ctx.reply(
        "بعد از اتمام کار و ارسال محتوا بر روی آپلود محتوا🗂 بزنید تا عملیات انجام شود."
      );
      return true;
    }
    return false;
  }

  private deleteChannel(ctx: SessionContext) {
    if (ctx.from?.id !== this.creator) return;
    if (ctx.session.deleteChannel === false) return;
    let users: UserScheme[] = JSON.parse(
      fs.readFileSync("./data/users.json", "utf8")
    );
    let index = users.findIndex((user) => user.id === ctx.from?.id);
    type ID = Partial<{
      content: string | number;
      type: "link" | "id" | "username";
    }>;
    let detectChannel = ctx.message?.text;
    let id: ID = {};
    if (detectChannel?.includes("@")) {
      id.content = detectChannel.split("@").filter((item) => item !== "")[0];
      id.type = "username";
    } else if (/[0-9]/g.test(detectChannel!))
      id = { type: "id", content: -Math.abs(+detectChannel!) };
    // else if (
    //   detectChannel?.includes("http") ||
    //   detectChannel?.includes("t.me")
    // ) {
    //   id = { type: "link", content: ctx.message?.text };
    // }
    else {
      if (detectChannel !== "بازگشت🔙") {
        ctx.reply("کانال یافت نشد. آیدی یا یوزرنیم کانال اشتباه است.");
      }
      return;
    }
    if (id.type !== "link") {
      users[index].lock = users[index].lock?.filter(
        (lock) => lock?.[id?.type!] !== id.content
      );
      fs.writeFileSync("./data/users.json", JSON.stringify(users));
      ctx.session.deleteChannel = false;
      ctx.reply(`قفل کانال برداشته شد.`, {
        reply_markup: {
          keyboard: kb.channelKeyboard.keyboard,
          resize_keyboard: true,
        },
      });
    }
  }

  private getReferralContent(ctx: SessionContext, refId?: string) {
    let referral = refId ?? ctx.match;
    if (!referral?.includes("ref")) return false;
    let refParse: string[] = referral.toString().split("_");
    refParse.shift();
    let users: UserScheme[] = JSON.parse(
      fs.readFileSync("./data/users.json", "utf8")
    );
    let index = users.findIndex((user) => user.id === +refParse[0]);
    let refIndex = users[index].posts.findIndex(
      (post) =>
        post.referral_link === refParse.filter((_, i) => i !== 0).join("_")
    );
    if (refIndex === -1) {
      ctx.reply("محتوا یافت نشد.");
      return;
    }
    let content = users[index].posts[refIndex];
    let text = `${content.text}
      
تعداد دریافتی ها : ${content.views! + 1}`;
    if (content.type === "photo") {
      this.bot.api.sendPhoto(ctx.chat?.id!, content.file?.file_id as string, {
        caption: text,
      });
    } else if (content.type === "audio") {
      this.bot.api.sendAudio(ctx.chat?.id!, content.file?.file_id as string, {
        caption: text,
      });
    } else if (content.type === "document") {
      this.bot.api.sendDocument(
        ctx.chat?.id!,
        content.file?.file_id as string,
        {
          caption: text,
        }
      );
    } else if (content.type === "video") {
      this.bot.api.sendVideo(ctx.chat?.id!, content.file?.file_id as string, {
        caption: text,
      });
    } else if (content.type === "voice") {
      this.bot.api.sendVoice(ctx.chat?.id!, content.file?.file_id as string, {
        caption: text,
      });
    } else if (content.type === "text") {
      this.bot.api.sendMessage(ctx.chat?.id!, text);
    }
    users[index].posts[refIndex].views! += 1;
    fs.writeFileSync("./data/users.json", JSON.stringify(users));
  }
  private hasCreator(ctx: Context) {
    if (ctx.from?.id === this.creator) return true;
    return false;
  }
}

export default User;
