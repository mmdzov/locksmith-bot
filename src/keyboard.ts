import { Keyboard } from "grammy";

class keyboard {
  userKeyboard() {
    let main = ["قفل به کانال🔐", "مانیتورینگ📈", "ارسال🕊"];
    let channel = ["کانال جدید", "مشاهده کانال ها", "حذف کانال", "بازگشت"];
    let send = ["ارسال به کانال", "ارسال به همینجا"];
    let upload = ["بازگشت", "آپلود محتوا"];
    let cancel = "بازگشت";
    let mainKeyboard = new Keyboard().add(...main.reverse());
    let channelKeyboard = new Keyboard()
      .text(channel[3])
      .row()
      .text(channel[2])
      .text(channel[1])
      .text(channel[0])
      .row();
    let sendKeyboard = new Keyboard().add(...send);
    let cancelKeyboard = new Keyboard().text(cancel);
    let uploadKeyboard = new Keyboard().add(...upload);
    return {
      mainKeyboard,
      channelKeyboard,
      cancelKeyboard,
      sendKeyboard,
      uploadKeyboard,
    };
  }
}

export default new keyboard();
