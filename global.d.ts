import { PhotoSize } from "@grammyjs/types";
import { Api, Context, RawApi, SessionFlavor } from "grammy";

//* datas

export interface UploadFileScheme {
  file_id: string | undefined;
  file_unique_id: string;
  filename?: unknown;
}

export type UploadTypeAllows =
  | "photo"
  | "audio"
  | "voice"
  | "video"
  | "document"
  | "text";

export interface UploadContent {
  file: UploadFileScheme;
  text: string;
  author_id: number;
  referral_link: string;
  type: UploadTypeAllows;
  views: number;
}
export interface User {
  id: number;
  lock?: Partial<ChannelType[]>;
  posts: Partial<UploadContent>[];
}
export interface IToken {
  id: number;
  TOKEN: string;
  [index: string]: string | number;
}

//* sessions
export interface UserJoinedSession {
  channels: ChannelType[] | undefined;
  failedJoin: number;
}
export interface ChannelType {
  id: number;
  username: string;
  link?: undefined;
}

export interface UploadDataSession {
  uploadDataSession: Partial<UploadContent> | undefined;
}

export interface UploadType {
  uploadType: "upload" | undefined;
}

export interface ChannelSession {
  uid: number;
  title: "ChannelSession" | undefined;
  delete;
}

export interface DeleteChannel {
  deleteChannel: boolean;
}
export interface Referral {
  refId: string | undefined;
}

type Sessions = ChannelSession &
  UserJoinedSession &
  Referral &
  UploadType &
  DeleteChannel &
  UploadDataSession;

//bot type using session and session context
export type BotType = Bot<Context & SessionFlavor<Sessions>, Api<RawApi>>;
export type SessionContext = Context & SessionFlavor<Sessions>;
