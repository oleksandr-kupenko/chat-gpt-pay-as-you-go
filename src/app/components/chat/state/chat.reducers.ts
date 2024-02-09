import {Chat, GPT_MODEL} from '../../../app.interface';
import {createReducer, on} from '@ngrx/store';
import {addChatMessageAction, changeChatModelAction, createNewChatAction, initChatAction} from './chat.actions';
import {createId} from '../../../utils';
import {createEmptyChat} from '../chat.utils';

export interface ChatState {
  currentChatId: string;
  lastSelectedModel: GPT_MODEL | string;
  chats: Chat[];
}

export const initialChatState: ChatState = {
  currentChatId: createId(),
  lastSelectedModel: GPT_MODEL.GPT_35,
  chats: [],
};

export const chatReducers = createReducer(
  initialChatState,
  on(initChatAction, (state, {id}) => {
    const foundedChat = state.chats.find((chat) => chat.id === id);
    let updatedChats = [...state.chats];
    if (!foundedChat) {
      const newChat: Chat = createEmptyChat(id, state.lastSelectedModel);
      updatedChats = [newChat, ...updatedChats];
    }
    return {...state, currentChatId: id, chats: updatedChats};
  }),
  on(createNewChatAction, (state) => {
    const newChatId = createId();
    const newChat = createEmptyChat(newChatId, state.lastSelectedModel);
    return {...state, chats: [newChat, ...state.chats]};
  }),
  on(addChatMessageAction, (state, {message}) => {
    const updatedChats = state.chats.map((chat) => {
      if (chat.id === state.currentChatId) {
        console.log('message', message);
        return {...chat, messages: [...chat.messages, message]};
      } else {
        return chat;
      }
    });
    return {...state, chats: updatedChats};
  }),
  on(changeChatModelAction, (state, {model}) => {
    const updatedChats = state.chats.map((chat) => (chat.id === state.currentChatId ? {...chat, model} : chat));
    return {...state, lastSelectedModel: model, chats: updatedChats};
  }),
);

export const chatFeatureKey = 'chat';
