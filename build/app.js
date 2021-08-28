"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = __importDefault(require("./command"));
var bot_1 = __importDefault(require("./config/bot"));
command_1.default.exec();
bot_1.default.start();
