import {Chat, GPT_MODEL} from '../../app.interface';
import {createId} from '../../utils';

export const createEmptyChat = (id?: string, model?: GPT_MODEL | string): Chat => {
  return {
    id: id || createId(),
    model: model || GPT_MODEL.GPT_35,
    messages: [],
    name: 'New chat',
    tokens: 0,
    created: new Date().getTime(),
  };
};
