"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var grammy_1 = require("grammy");
var keyboard_1 = __importDefault(require("./keyboard"));
var kb = keyboard_1.default.userKeyboard();
var User = /** @class */ (function () {
    function User(bot, creator) {
        var _this = this;
        this.bot = bot;
        this.creator = creator;
        this.bot.use(grammy_1.session({
            initial: function () {
                return { uid: 0 };
            },
        }));
        this.bot.command("start", function (ctx) {
            var _a, _b;
            if (((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id) === _this.creator) {
                ctx.api.sendMessage((_b = ctx.from) === null || _b === void 0 ? void 0 : _b.id, "\u06A9\u0644\u06CC\u062F \u0647\u0627\u06CC \u0645\u062F\u06CC\u0631\u06CC\u062A \u0628\u0631\u0627\u06CC \u0634\u0645\u0627 \u0641\u0639\u0627\u0644 \u0627\u0633\u062A.", {
                    reply_markup: {
                        keyboard: kb.mainKeyboard.keyboard,
                        resize_keyboard: true,
                    },
                });
            }
        });
        this.bot.on("message::mention", function (ctx) {
            console.log(ctx.session.uid);
        });
        this.bot.hears("قفل به کانال🔐", function (ctx) {
            var _a;
            if (!_this.hasCreator(ctx))
                return;
            ctx.api.sendMessage((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id, "\u0644\u0637\u0641\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F...", {
                reply_markup: {
                    keyboard: kb.channelKeyboard.keyboard,
                    resize_keyboard: true,
                },
            });
        });
        this.bot.hears("بازگشت", function (ctx) {
            var _a;
            if (!_this.hasCreator(ctx))
                return;
            ctx.api.sendMessage((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id, "\u0644\u0637\u0641\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F...", {
                reply_markup: {
                    keyboard: kb.mainKeyboard.keyboard,
                    resize_keyboard: true,
                },
            });
        });
        this.bot.hears("کانال جدید", function (ctx) {
            var _a;
            if (!_this.hasCreator(ctx))
                return;
            ctx.api.sendMessage((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id, "\u062F\u0631 \u0627\u0628\u062A\u062F\u0627 \u0628\u0647 \u0645\u0646\u0638\u0648\u0631 \u0628\u0631\u0631\u0633\u06CC \u0639\u0636\u0648\u06CC\u062A \u06A9\u0627\u0631\u0628\u0631 \u0628\u0647 \u06A9\u0627\u0646\u0627\u0644 \u0645\u06CC \u0628\u0627\u06CC\u0633\u062A \u0631\u0628\u0627\u062A \u0627\u062F\u0645\u06CC\u0646 \u06A9\u0627\u0646\u0627\u0644 \u0634\u0648\u062F \u0648 \u062F\u0631 \u0642\u062F\u0645 \u0628\u0639\u062F \u0622\u06CC\u062F\u06CC \u06A9\u0627\u0646\u0627\u0644 \u0631\u0627 \u0628\u0641\u0631\u0633\u062A\u06CC\u062F \u062A\u0627 \u062B\u0628\u062A \u0634\u0648\u062F", {
                reply_markup: {
                    keyboard: kb.cancelKeyboard.keyboard,
                    resize_keyboard: true,
                },
            });
            ctx.session.uid = 10;
        });
    }
    User.prototype.hasCreator = function (ctx) {
        var _a;
        if (((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id) === this.creator)
            return true;
        return false;
    };
    return User;
}());
exports.default = User;
