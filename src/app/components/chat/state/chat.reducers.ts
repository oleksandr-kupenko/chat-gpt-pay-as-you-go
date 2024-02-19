import {Chat, ChatEntities, GPT_MODEL, Message} from '../../../app.interface';
import {createReducer, on, Store} from '@ngrx/store';
import {
  addChatMessageAction,
  changeChatModelAction,
  createNewChatAction,
  deleteChatAction,
  initChatsAction,
  initCurrentChatAction,
} from './chat.actions';
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
  currentChatId: 'new',
  lastSelectedModel: GPT_MODEL.GPT_35,
  chats: chatAdapter.getInitialState(),
};

export const chatReducers = createReducer(
  initialChatState,
  on(initChatsAction, (state, {lastSelectedModel, chats}) => {
    return {...state, chats: chats, lastSelectedModel};
  }),
  on(initCurrentChatAction, (state, {id}) => {
    let updatedChats: Chat[] = [...chatAdapter.getSelectors().selectAll(state.chats)];
    return {...state, currentChatId: id, chats: chatAdapter.upsertMany(updatedChats, state.chats)};
  }),
  on(createNewChatAction, (state, {id}) => {
    const newChat = createEmptyChat(id, state.lastSelectedModel);

    return {...state, currentChatId: id, chats: chatAdapter.addOne(newChat, state.chats)};
  }),
  on(deleteChatAction, (state, {id}) => {
    return {...state, currentChatId: id, chats: chatAdapter.removeOne(id, state.chats)};
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
