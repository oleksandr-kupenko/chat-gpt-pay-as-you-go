import {EntityState} from '@ngrx/entity';

export const API_KEY = 'chat_key';
export const CONFIG = 'config';

export interface Model {
  id: string;
  name: string;
  model: string;
  isCustom?: boolean;
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
}

export interface Config {
  chat: ChatsConfig;
}

export interface ChatsConfig {
  chats: (ChatWithMessagesArr | undefined)[];
  currentChatId: string | null;
  lastSelectedModelId: string;
  models: Model[];
}

export interface Chat {
  name: string;
  id: string;
  messages: MessageEntities;
  tokens: number;
  modelId: string;
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
  isEditable?: boolean;
  isChanged?: boolean;
  completion_tokens?: number;
}

export interface MessageWithoutId extends Omit<Message, 'id'> {
  id?: never;
}

export interface RequestData {
  model: string;
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
  usage: ResponseTokens;
  system_fingerprint: null;
}

export interface ResponseTokens {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}
