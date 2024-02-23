import {createFeatureSelector, createSelector} from '@ngrx/store';
import {chatFeatureKey, ChatState} from './chat.reducers';
import {Chat} from '../../../app.interface';

const selectChatState = createFeatureSelector<ChatState>(chatFeatureKey);

export const currentChatSelector = (id: string) =>
  createSelector(selectChatState, (chatState: ChatState) => {
    return chatState.chats.entities[id];
  });

export const chatStateSelector = createSelector(selectChatState, (chatState: ChatState) => {
  return chatState;
});

export const chatsListSelector = createSelector(selectChatState, (chatState: ChatState): Chat[] => {
  return Object.values(chatState.chats.entities ?? {}).filter((chat): chat is Chat => chat !== undefined);
});

export const someMessageEditedSelector = createSelector(selectChatState, (chatState: ChatState) => {
  const currentChat = chatState.chats.entities[chatState.currentChatId];
  if (currentChat) {
    return Object.values(currentChat.messages.entities).some((message) => message?.isChanged);
  } else {
    return false;
  }
});
