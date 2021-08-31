import { Keyboard } from "grammy";

class keyboard {
  userKeyboard() {
    let main = ["مدیریت قفل🔐", "مانیتورینگ📈", "آپلود🗳"];
    let channel = ["افزودن📌", "مشاهده 👁‍🗨", "حذف❌", "بازگشت🔙"];
    let upload = ["بازگشت🔙", "آپلود محتوا🗂"];
    let cancel = "بازگشت🔙";
    let mainKeyboard = new Keyboard().add(...main.reverse());
    let channelKeyboard = new Keyboard()
      .text(channel[3])
      .row()
      .text(channel[2])
      .text(channel[1])
      .text(channel[0])
      .row();
    let cancelKeyboard = new Keyboard().text(cancel);
    let uploadKeyboard = new Keyboard().add(...upload);
    return {
      keys: [...main, ...channel, ...upload, cancel],
      mainKeyboard,
      channelKeyboard,
      cancelKeyboard,
      uploadKeyboard,
    };
  }
}

export default new keyboard();
