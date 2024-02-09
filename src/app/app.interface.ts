import {EntityState} from '@ngrx/entity';

export const CHAT_KEY = 'chat_key';
export const STATE_KEY = 'chat_key';
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

export interface Chat {
  name: string;
  id: string;
  messages: Message[];
  tokens: number;
  model: GPT_MODEL | string;
  created: number;
}

export interface ChatState extends EntityState<Chat> {}

export interface Message {
  role: ROLE;
  content: string;
}

export interface RequestData {
  model: GPT_MODEL;
  messages: Message[];
}

export interface ResponseData {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: [
    {
      index: number;
      message: Message;
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
