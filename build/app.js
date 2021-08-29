"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = __importDefault(require("./command"));
var bot_1 = __importDefault(require("./config/bot"));
var fs_1 = __importDefault(require("fs"));
var grammy_1 = require("grammy");
var user_1 = __importDefault(require("./user"));
//execute all commands
command_1.default.exec();
var datas = fs_1.default.readFileSync("./data/tokens.json", "utf8");
var tokens = JSON.parse(datas);
tokens.forEach(function (item) {
    var b = new grammy_1.Bot(item.TOKEN);
    new user_1.default(b, item.id);
    b;
    b.start();
});
bot_1.default.on("message", function (ctx) {
    console.log(ctx.message);
});
bot_1.default.start({ timeout: 10000, drop_pending_updates: true });
