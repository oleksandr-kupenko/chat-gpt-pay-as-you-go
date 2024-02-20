import {EntityState} from '@ngrx/entity';

export const API_KEY = 'chat_key';
export const CONFIG = 'config';
export enum GPT_MODEL {
  GPT_35 = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4-1106-preview',
}

export enum ROLE {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}

export class State {
  settings: {
    rememberKey: boolean;
  } = {
    rememberKey: false,
  };

  chat: {
    model: GPT_MODEL | string;
    chats: Chat[];
  } = {
    model: GPT_MODEL.GPT_35,
    chats: [],
  };
}

export interface Config {
  chat: ChatsConfig;
}

export interface ChatsConfig {
  chats: (ChatWithMessagesArr | undefined)[];
  currentChatId: string | null;
  lastSelectedModel: GPT_MODEL | string | null;
}

export interface Chat {
  name: string;
  id: string;
  messages: MessageEntities;
  tokens: number;
  model: GPT_MODEL | string;
  created: number;
  isEditableName?: boolean;
  isRenamed?: boolean;
}

export interface ChatWithMessagesArr extends Omit<Chat, 'messages'> {
  messages: Message[];
}

export interface ChatEntities extends EntityState<Chat> {}
export interface MessageEntities extends EntityState<Message> {}

export interface Message {
  role: ROLE;
  content: string;
  id: string;
}

export interface MessageWithoutId extends Omit<Message, 'id'> {
  id?: never;
}

export interface RequestData {
  model: GPT_MODEL;
  messages: MessageWithoutId[];
}

export interface ResponseData {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: [
    {
      index: number;
      message: MessageWithoutId;
      logprobs: null | unknown;
      finish_reason: 'stop' | string;
    },
  ];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  system_fingerprint: null;
}
