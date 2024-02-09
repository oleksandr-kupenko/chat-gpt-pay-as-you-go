import {createFeatureSelector, createSelector} from '@ngrx/store';
import {chatFeatureKey, ChatState} from './chat.reducers';

const selectChatState = createFeatureSelector<ChatState>(chatFeatureKey);

export const currentChatSelector = (id: string) =>
  createSelector(selectChatState, (chatState: ChatState) => {
    return chatState.chats.find((chat) => chat.id === id);
  });
