"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bot_1 = __importDefault(require("./config/bot"));
var Commands = /** @class */ (function () {
    function Commands() {
    }
    Commands.prototype.start = function () {
        bot_1.default.command("start", function (ctx) {
            var _a, _b;
            ctx.reply("\u0633\u0644\u0627\u0645 " + ((_b = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.from) === null || _b === void 0 ? void 0 : _b.first_name) + " \u0628\u0647 \u0642\u0641\u0644 \u0633\u0627\u0632 \u06A9\u0627\u0646\u0627\u0644 \u0648 \u06AF\u0631\u0648\u0647 \u062E\u0648\u0634 \u0627\u0648\u0645\u062F\u06CC.\n\u0645\u06CC \u062E\u0648\u0627\u06CC \u0631\u0628\u0627\u062A \u0642\u0641\u0644 \u062E\u0648\u062F\u062A\u0648 \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u06CC\u061F\n\u062E\u0628 \u0631\u0648\u06CC /newbot \u0628\u0632\u0646 \u062A\u0627 \u0628\u0647\u062A \u0628\u06AF\u0645 \u0686\u06CC\u06A9\u0627\u0631 \u06A9\u0646\u06CC\n              ");
        });
    };
    Commands.prototype.newbot = function () {
        bot_1.default.command("newbot", function (ctx) {
            console.log(ctx.message);
        });
    };
    Commands.prototype.exec = function () {
        this.start();
        this.newbot();
    };
    return Commands;
}());
exports.default = new Commands();
