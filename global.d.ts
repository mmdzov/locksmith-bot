import { Api, Context, RawApi, SessionFlavor } from "grammy";

//datas
export interface IToken {
  id: number;
  TOKEN: string;
  [index: string]: string | number;
}

export interface setChannel {
  uid: number;
}

export type BotType = Bot<Context & SessionFlavor<setChannel>, Api<RawApi>>;
export type SessionContext = Context & SessionFlavor<setChannel>;
