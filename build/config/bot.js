"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var grammy_1 = require("grammy");
dotenv_1.default.config();
var bot = new grammy_1.Bot(process.env.TOKEN);
exports.default = bot;
