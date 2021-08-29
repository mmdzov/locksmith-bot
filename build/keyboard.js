"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var grammy_1 = require("grammy");
var keyboard = /** @class */ (function () {
    function keyboard() {
    }
    keyboard.prototype.userKeyboard = function () {
        var _a;
        var main = ["قفل به کانال🔐", "مانیتورینگ📈", "ارسال🕊"];
        var channel = ["کانال جدید", "مشاهده کانال ها", "حذف کانال", "بازگشت"];
        var cancel = "بازگشت";
        var mainKeyboard = (_a = new grammy_1.Keyboard()).add.apply(_a, main.reverse()).row();
        var channelKeyboard = new grammy_1.Keyboard()
            .text(channel[3])
            .row()
            .text(channel[2])
            .text(channel[1])
            .text(channel[0])
            .row();
        var cancelKeyboard = new grammy_1.Keyboard().text(cancel);
        return { mainKeyboard: mainKeyboard, channelKeyboard: channelKeyboard, cancelKeyboard: cancelKeyboard };
    };
    return keyboard;
}());
exports.default = new keyboard();
