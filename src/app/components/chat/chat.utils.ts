import {Chat, GPT_MODEL, Message, MessageWithoutId} from '../../app.interface';
import {createId} from '../../utils';
import {messagesAdapter} from './state/chat.reducers';

export const createEmptyChat = (id?: string, model?: GPT_MODEL | string): Chat => {
  return {
    id: id || createId(),
    model: model || GPT_MODEL.GPT_35,
    messages: messagesAdapter.getInitialState(),
    name: 'New chat',
    tokens: 0,
    created: new Date().getTime(),
  };
};

export const addIdToMessage = (message: MessageWithoutId): Message => {
  return {...message, id: createId()};
};

export const removeMessageId = (messages: Message[]): MessageWithoutId[] => {
  return messages.map(({id, ...rest}) => ({...rest}));
};
