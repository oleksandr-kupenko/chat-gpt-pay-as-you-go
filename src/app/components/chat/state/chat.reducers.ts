import {Chat, ChatEntities, GPT_MODEL, Message} from '../../../app.interface';
import {createReducer, on} from '@ngrx/store';
import {addChatMessageAction, changeChatModelAction, createNewChatAction, initChatAction} from './chat.actions';
import {createId} from '../../../utils';
import {createEmptyChat} from '../chat.utils';
import {createEntityAdapter, EntityAdapter} from '@ngrx/entity';

export interface ChatState {
  currentChatId: string;
  lastSelectedModel: GPT_MODEL | string;
  chats: ChatEntities;
}

export const messagesAdapter: EntityAdapter<Message> = createEntityAdapter<Message>();
export const chatAdapter: EntityAdapter<Chat> = createEntityAdapter<Chat>();

export const initialChatState: ChatState = {
  currentChatId: createId(),
  lastSelectedModel: GPT_MODEL.GPT_35,
  chats: chatAdapter.getInitialState(),
};

export const chatReducers = createReducer(
  initialChatState,
  on(initChatAction, (state, {id}) => {
    const foundedChat = chatAdapter.getSelectors().selectEntities(state.chats)[id];
    let updatedChats: Chat[] = [...chatAdapter.getSelectors().selectAll(state.chats)];

    if (!foundedChat) {
      const newChat: Chat = createEmptyChat(id, state.lastSelectedModel);
      updatedChats = [newChat, ...updatedChats];
    }

    return {...state, currentChatId: id, chats: chatAdapter.upsertMany(updatedChats, state.chats)};
  }),
  on(createNewChatAction, (state) => {
    const newChatId = createId();
    const newChat = createEmptyChat(newChatId, state.lastSelectedModel);

    return {...state, currentChatId: newChatId, chats: chatAdapter.addOne(newChat, state.chats)};
  }),
  on(addChatMessageAction, (state, {message}) => {
    const currentChat = state.chats.entities[state.currentChatId];
    if (currentChat) {
      const updatedMessages = messagesAdapter.addOne(message, currentChat.messages);

      const updatedChat: Chat = {
        ...currentChat,
        messages: updatedMessages,
      };

      return {
        ...state,
        chats: chatAdapter.updateOne({id: state.currentChatId, changes: updatedChat}, state.chats),
      };
    }

    return state;
  }),
  on(changeChatModelAction, (state, {model}) => {
    return {
      ...state,
      lastSelectedModel: model,
    };
  }),
);

export const chatFeatureKey = 'chat';
