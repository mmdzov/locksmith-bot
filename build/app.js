"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = __importDefault(require("./command"));
var bot_1 = __importDefault(require("./config/bot"));
var fs_1 = __importDefault(require("fs"));
var grammy_1 = require("grammy");
//execute all commands
command_1.default.exec();
var datas = fs_1.default.readFileSync("src/data/tokens.json", "utf8");
var tokens = JSON.parse(datas);
tokens.forEach(function (item) {
    var b = new grammy_1.Bot(item);
    b.on("message", function (ctx) {
        var _a;
        console.log((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text);
    });
    b.start();
});
bot_1.default.on("message", function (ctx) {
    console.log(ctx.message);
});
bot_1.default.start({ timeout: 10000, drop_pending_updates: true });
