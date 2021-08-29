import { Api, Context, RawApi, SessionFlavor } from "grammy";

//datas
export interface IToken {
  id: number;
  TOKEN: string;
  [index: string]: string | number;
}

export interface ChannelSession {
  uid: number;
  title: "ChannelSession" | undefined;
}

export interface User {
  id: number;
  lock?: Partial<{ id: number; username: string }[]>;
}

//bot type using session and session context
export type BotType = Bot<Context & SessionFlavor<ChannelSession>, Api<RawApi>>;
export type SessionContext = Context & SessionFlavor<ChannelSession>;
