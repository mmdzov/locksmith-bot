"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bot_1 = __importDefault(require("./config/bot"));
var grammy_1 = require("grammy");
var fs_1 = __importDefault(require("fs"));
var user_1 = __importDefault(require("./user"));
var Commands = /** @class */ (function () {
    function Commands() {
    }
    Commands.prototype.startSubBot = function () { };
    Commands.prototype.start = function () {
        bot_1.default.command("start", function (ctx) {
            var _a, _b;
            ctx.reply("\u0633\u0644\u0627\u0645 " + ((_b = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.from) === null || _b === void 0 ? void 0 : _b.first_name) + " \u0628\u0647 \u0642\u0641\u0644 \u0633\u0627\u0632 \u06A9\u0627\u0646\u0627\u0644 \u0648 \u06AF\u0631\u0648\u0647 \u062E\u0648\u0634 \u0627\u0648\u0645\u062F\u06CC.\n\u0645\u06CC \u062E\u0648\u0627\u06CC \u0631\u0628\u0627\u062A \u0642\u0641\u0644 \u062E\u0648\u062F\u062A\u0648 \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u06CC\u061F\n\u062E\u0628 \u0631\u0648\u06CC /newbot \u0628\u0632\u0646 \u062A\u0627 \u0628\u0647\u062A \u0628\u06AF\u0645 \u0686\u06CC\u06A9\u0627\u0631 \u06A9\u0646\u06CC\n              ");
        });
    };
    Commands.prototype.newbot = function () {
        var _this = this;
        bot_1.default.command("newbot", function (ctx) { return __awaiter(_this, void 0, void 0, function () {
            var TOKEN_1, datas, tokens, index, b, e_1;
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        if (!(((_b = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.trim()) !== "/newbot")) return [3 /*break*/, 7];
                        TOKEN_1 = (_d = (_c = ctx.message) === null || _c === void 0 ? void 0 : _c.text) === null || _d === void 0 ? void 0 : _d.trim().split("/newbot-").filter(function (_, index) { return index !== 0; }).join("");
                        datas = fs_1.default.readFileSync("./data/tokens.json", "utf8");
                        tokens = JSON.parse(datas);
                        index = tokens.findIndex(function (token) { return token.TOKEN === TOKEN_1; });
                        if (!(index === -1)) return [3 /*break*/, 5];
                        _h.label = 1;
                    case 1:
                        _h.trys.push([1, 3, , 4]);
                        tokens.push({ TOKEN: TOKEN_1, id: (_e = ctx.from) === null || _e === void 0 ? void 0 : _e.id });
                        b = new grammy_1.Bot(TOKEN_1);
                        return [4 /*yield*/, b.init()];
                    case 2:
                        _h.sent();
                        new user_1.default(b, (_f = ctx.from) === null || _f === void 0 ? void 0 : _f.id);
                        fs_1.default.writeFileSync("./data/tokens.json", JSON.stringify(tokens));
                        b.start();
                        bot_1.default.api.sendMessage((_g = ctx.from) === null || _g === void 0 ? void 0 : _g.id, "\u0631\u0628\u0627\u062A \u0634\u0645\u0627 \u0628\u0627 \u0622\u06CC\u062F\u06CC @" + b.botInfo.username + " \u0628\u0627 \u0645\u0648\u0641\u0642\u06CC\u062A \u0633\u0627\u062E\u062A\u0647 \u0634\u062F \u0648\u0627\u0631\u062F\u0634 \u0634\u0648\u06CC\u062F \u0648 /start \u0628\u0632\u0646\u06CC\u062F.");
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _h.sent();
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        ctx.reply("\u0631\u0628\u0627\u062A \u0634\u0645\u0627 \u0642\u0628\u0644\u0627 \u0627\u06CC\u062C\u0627\u062F \u0634\u062F\u0647.");
                        _h.label = 6;
                    case 6: return [2 /*return*/];
                    case 7:
                        ctx.reply("\u200D\u200D\u062E\u0628 \u062F\u0648\u0633\u062A \u0645\u0646 \u062D\u0627\u0644\u0627 \u062A\u0648\u06A9\u0646 \u0631\u0628\u0627\u062A\u062A \u0631\u0648 \u0628\u0627 \u062F\u0633\u062A\u0648\u0631 /newbot-TOKEN \u0628\u0641\u0631\u0633\u062A \u062A\u0627 \u0628\u0631\u0627\u062A \u0641\u0639\u0627\u0644\u0634 \u06A9\u0646\u0645.\n\u0628\u0631\u0627\u06CC \u062F\u0631\u06CC\u0627\u0641\u062A \u062A\u0648\u06A9\u0646 \u0627\u0648\u0644 \u0628\u0627\u06CC\u062F \u0628\u0647 @botfather \u0645\u0631\u0627\u062C\u0639\u0647 \u06A9\u0646\u06CC.\n\u0628\u0639\u062F \u0631\u0648\u06CC /newbot \u0645\u06CC\u0632\u0646\u06CC.\n\u062F\u0631 \u0627\u0628\u062A\u062F\u0627 \u0646\u0627\u0645 \u0631\u0628\u0627\u062A\u062A \u0631\u0648 \u0648\u0627\u0631\u062F \u0645\u06CC\u06A9\u0646.\n\u062F\u0631 \u0642\u062F\u0645 \u0628\u0639\u062F \u0627\u0632\u062A \u0645\u06CC\u062E\u0648\u0627\u062F \u06A9\u0647 \u0622\u06CC\u062F\u06CC \u0631\u0628\u0627\u062A\u062A \u0631\u0648 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC.\n\u0622\u06CC\u062F\u06CC \u0631\u0628\u0627\u062A \u0646\u0628\u0627\u06CC\u062F \u062A\u06A9\u0631\u0627\u0631\u06CC \u0628\u0627\u0634\u0647 \u0648 \u062F\u0631 \u0627\u0646\u062A\u0647\u0627 \u0628\u0627\u06CC\u062F \u0639\u0646\u0648\u0627\u0646 bot \u062D\u062A\u0645\u0627 \u0630\u06A9\u0631 \u0634\u062F\u0647 \u0628\u0627\u0634\u0647 \u0645\u0627\u0646\u0646\u062F Locksmithchannelbot \u0648 \u06CC\u0627\u062F\u062A \u0628\u0627\u0634\u0647 \u0627\u0648\u0646 \u0622\u06CC\u062F\u06CC \u06A9\u0647 \u0645\u06CC\u062E\u0648\u0627\u06CC \u0628\u0631\u0627\u06CC \u0631\u0628\u0627\u062A\u062A \u062F\u0631\u0646\u0638\u0631 \u0628\u06AF\u06CC\u0631\u06CC\u0648 \u0628\u062F\u0648\u0646 @ \u0628\u0631\u0627\u0634 \u0628\u0641\u0631\u0633\u062A\u06CC.\n\u062D\u0627\u0644\u0627 \u0631\u0628\u0627\u062A\u062A \u0622\u0645\u0627\u062F\u0633 \u0648 \u0628\u0627\u06CC\u062F \u062A\u0648\u06A9\u0646\u06CC \u0628\u0647\u062A \u0628\u062F\u0647 \u0645\u062B\u0644 \u0627\u06CC\u0646\n1804787525:AAHuvQIKdGph5YX1RQo_1fQuryGWZfJl6aI\n\u0627\u0648\u0646 \u0631\u0648 \u06A9\u067E\u06CC \u0645\u06CC \u06A9\u0646\u06CC \u0648 \u0647\u0645\u06CC\u0646\u062C\u0627 \u0628\u0631\u0627\u0645 \u0645\u06CC \u0641\u0631\u0633\u062A\u06CC \u0627\u06AF\u0647 \u0628\u0647\u062A \u062A\u0648\u06A9\u0646 \u0631\u0648 \u0646\u062F\u0627\u062F \u062D\u062A\u0645\u0627 \u0627\u0632\u062A \u0645\u06CC\u062E\u0648\u0627\u062F \u06A9\u0647 \u0622\u06CC\u062F\u06CC \u062F\u06CC\u06AF\u0631\u06CC \u0628\u0631\u0627\u06CC \u0631\u0628\u0627\u062A\u062A \u062F\u0631\u0646\u0638\u0631 \u0628\u06AF\u06CC\u0631\u06CC \u0648 \u0622\u06CC\u062F\u06CC \u0627\u06CC \u06A9\u0647 \u0628\u0631\u0627\u0634 \u0641\u0631\u0633\u062A\u0627\u062F\u06CC \u0642\u0628\u0644\u0627 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0634\u062F\u0647.\n\n\u0646\u0645\u0648\u0646\u0647 \u062A\u0648\u06A9\u0646 \u0627\u0631\u0633\u0627\u0644\u06CC \u0634\u0645\u0627 \u0628\u0627\u06CC\u062F \u0645\u0627\u0646\u0646\u062F \u0646\u0645\u0648\u0646\u0647 \u0632\u06CC\u0631 \u0628\u0627\u0634\u062F:\n/newbot-1804787525:AAHuvQIKdGph5YX1RQo_1fQuryGWZfJl6aI\n");
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Commands.prototype.exec = function () {
        this.start();
        this.newbot();
    };
    return Commands;
}());
exports.default = new Commands();
