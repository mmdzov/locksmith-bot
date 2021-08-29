import { Keyboard } from "grammy";

class keyboard {
  userKeyboard() {
    let main = ["قفل به کانال🔐", "مانیتورینگ📈", "ارسال🕊"];
    let channel = ["کانال جدید", "مشاهده کانال ها", "حذف کانال", "بازگشت"];
    let cancel = "بازگشت";
    let mainKeyboard = new Keyboard().add(...main.reverse()).row();
    let channelKeyboard = new Keyboard()
      .text(channel[3])
      .row()
      .text(channel[2])
      .text(channel[1])
      .text(channel[0])
      .row();
    let cancelKeyboard = new Keyboard().text(cancel);
    return { mainKeyboard, channelKeyboard, cancelKeyboard };
  }
}

export default new keyboard();
