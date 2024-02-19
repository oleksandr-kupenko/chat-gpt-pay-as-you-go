import {Chat, ChatWithMessagesArr, Config, Message} from './app.interface';
import {AppState} from './state/app.state';
import {chatFeatureKey} from './components/chat/state/chat.reducers';

export const convertToHtml = (text: string) => {
  const paragraphs = text.split('\n').map((line) => `<p>${line}</p>`);
  return paragraphs.join('');
};

export const createId = () => {
  return Math.random().toString(36).substring(2) + new Date().getTime().toString(36);
};

export const transformStateToConfig = (state: AppState): Config => {
  const chatState = state[chatFeatureKey];
  let chatsArr: ChatWithMessagesArr[] = [];

  if (Object.values(chatState.chats.entities).length) {
    chatsArr = (Object.values(chatState.chats.entities) as Chat[]).map((chat) => {
      if (chat && chat.messages) {
        const messages = Object.values(chat.messages.entities) as Message[];
        return {...chat, messages: messages};
      } else {
        return {...chat, messages: []};
      }
    });
  }

  return {
    chat: {
      currentChatId: chatState.currentChatId,
      lastSelectedModel: chatState.lastSelectedModel,
      chats: chatsArr,
    },
  };
};
