import { Api, Context, RawApi, SessionFlavor } from "grammy";

export interface User {
  id: number;
  lock?: Partial<ChannelType[]>;
}
export interface IToken {
  id: number;
  TOKEN: string;
  [index: string]: string | number;
}

export interface ChannelType {
  id: number;
  username: string;
}

//sessions
export interface UserJoinedSession {
  channels: ChannelType[] | undefined;
  failedJoin: number
}

export interface ChannelSession {
  uid: number;
  title: "ChannelSession" | undefined;
}

type Sessions = ChannelSession & UserJoinedSession;

//bot type using session and session context
export type BotType = Bot<Context & SessionFlavor<Sessions>, Api<RawApi>>;
export type SessionContext = Context & SessionFlavor<Sessions>;
