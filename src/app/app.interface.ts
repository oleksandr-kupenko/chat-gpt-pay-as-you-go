export const CHAT_KEY = 'chat_key';
export enum GPT_MODEL {
  GPT_35 = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4-1106-preview',
}

export enum ROLE {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}

export interface config {
  chat: {
    model: GPT_MODEL;
  };
}

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
