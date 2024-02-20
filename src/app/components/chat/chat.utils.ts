import {Chat, ChatEntities, ChatWithMessagesArr, GPT_MODEL, Message, MessageWithoutId} from '../../app.interface';
import {createId} from '../../utils';
import {chatAdapter, messagesAdapter} from './state/chat.reducers';

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

export const transformChatsToChatsState = (
  chatsWithMessages: ChatWithMessagesArr[] | undefined | undefined[],
): ChatEntities => {
  const isChatWithMessagesArr = (
    src: ChatWithMessagesArr[] | undefined | undefined[],
  ): src is ChatWithMessagesArr[] => {
    return !!src && src.length != null && src.every((c) => c?.messages);
  };

  if (isChatWithMessagesArr(chatsWithMessages)) {
    const chats: Chat[] = chatsWithMessages.map((chatWithMessages) => ({
      ...chatWithMessages,
      messages: messagesAdapter.setAll(chatWithMessages.messages, messagesAdapter.getInitialState()),
    })) as Chat[];
    return chatAdapter.setAll(chats, chatAdapter.getInitialState());
  } else {
    return chatAdapter.getInitialState();
  }
};

export const createChatNameFromAnswer = (answer: string) => {
  let answerWithoutHTML = answer.replace(/<[^>]*>/g, '');
  const substring = answerWithoutHTML.substring(0, 30);
  let lastIndex = Math.max(substring.lastIndexOf(' '), substring.lastIndexOf(','), substring.lastIndexOf('.'));

  lastIndex = lastIndex === -1 ? substring.length : lastIndex;

  const resultSubstring = substring.substring(0, lastIndex);
  console.log(resultSubstring);

  return resultSubstring;
};
