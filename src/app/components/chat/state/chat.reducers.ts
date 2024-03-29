import {Chat, ChatEntities, Message, MessageEntities, Model, ROLE} from '../../../app.interface';
import {createReducer, on, Store} from '@ngrx/store';
import {
  addChatMessageAction,
  addNewModelAction,
  changeChatModelAction,
  clearMessagesUpdatedStatusAction,
  createNewChatAction,
  deleteAddedModelAction,
  deleteChatAction,
  deleteChatMessageAction,
  editChatNameAction,
  editMessageContentAction,
  initChatsAction,
  initCurrentChatAction,
  saveNewChatNameAction,
  saveNewMessageAction,
  updateChatTokensAction,
} from './chat.actions';
import {createChatNameFromAnswer, createEmptyChat} from '../chat.utils';
import {createEntityAdapter, EntityAdapter, Update} from '@ngrx/entity';
import {DEFAULT_MODELS} from '../chat.constants';

export interface ChatState {
  currentChatId: string;
  lastSelectedModelId: string;
  chats: ChatEntities;
  models: Model[];
}

export const messagesAdapter: EntityAdapter<Message> = createEntityAdapter<Message>();
export const chatAdapter: EntityAdapter<Chat> = createEntityAdapter<Chat>();

export const initialChatState: ChatState = {
  currentChatId: '',
  lastSelectedModelId: '1',
  chats: chatAdapter.getInitialState(),
  models: DEFAULT_MODELS,
};

export const chatReducers = createReducer(
  initialChatState,
  on(initChatsAction, (state, {lastSelectedModelId, chats, models}) => {
    const modelsList = models.length ? models : DEFAULT_MODELS;
    return {...state, chats: chats, lastSelectedModelId, models: modelsList};
  }),
  on(initCurrentChatAction, (state, {id}) => {
    let updatedChats: Chat[] = [...chatAdapter.getSelectors().selectAll(state.chats)];
    return {...state, currentChatId: id, chats: chatAdapter.upsertMany(updatedChats, state.chats)};
  }),
  on(createNewChatAction, (state, {id}) => {
    const newChat = createEmptyChat(id, state.lastSelectedModelId);
    return {...state, currentChatId: id, chats: chatAdapter.addOne(newChat, state.chats)};
  }),
  on(editChatNameAction, (state, {id, isEditable}) => {
    const chatToUpdate = state.chats.entities[id];
    const updatedChat: Update<Chat> = {
      id,
      changes: {
        ...chatToUpdate,
        isEditableName: isEditable,
      },
    };
    const updatedChatsState = chatAdapter.updateOne(updatedChat, state.chats);
    return {...state, chats: updatedChatsState};
  }),
  on(saveNewChatNameAction, (state, {id, newName}) => {
    const chatToUpdate = state.chats.entities[id];
    const updatedChat: Update<Chat> = {
      id,
      changes: {
        ...chatToUpdate,
        isEditableName: false,
        name: newName,
        isRenamed: true,
      },
    };
    const updatedChatsState = chatAdapter.updateOne(updatedChat, state.chats);
    return {...state, chats: updatedChatsState};
  }),
  on(deleteChatAction, (state, {id}) => {
    return {...state, currentChatId: id, chats: chatAdapter.removeOne(id, state.chats)};
  }),
  on(editMessageContentAction, (state, {id, isEditable}) => {
    const chatToUpdate = state.chats.entities[state.currentChatId] as Chat;

    const updatedMessage = {
      ...chatToUpdate.messages.entities[id],
      isEditable: isEditable,
    };

    const updatedMessages = messagesAdapter.updateOne({id: id, changes: updatedMessage}, chatToUpdate.messages);

    const updatedChat: Update<Chat> = {
      id: chatToUpdate.id,
      changes: {
        ...chatToUpdate,
        messages: updatedMessages,
      },
    };

    const updatedChatsState = chatAdapter.updateOne(updatedChat, state.chats);

    return {...state, chats: updatedChatsState};
  }),
  on(saveNewMessageAction, (state, {id, newContent}) => {
    const chatToUpdate = state.chats.entities[state.currentChatId] as Chat;

    const updatedMessage = {
      ...chatToUpdate.messages.entities[id],
      content: newContent,
      isEditable: false,
      isChanged: true,
    };

    const updatedMessages = messagesAdapter.updateOne({id: id, changes: updatedMessage}, chatToUpdate.messages);

    const updatedChat: Update<Chat> = {
      id: chatToUpdate.id,
      changes: {
        ...chatToUpdate,
        messages: updatedMessages,
      },
    };

    const updatedChatsState = chatAdapter.updateOne(updatedChat, state.chats);

    return {...state, chats: updatedChatsState};
  }),
  on(deleteChatMessageAction, (state, {id}) => {
    const chatToUpdate = state.chats.entities[state.currentChatId] as Chat;
    const updatedChat: Update<Chat> = {
      id: chatToUpdate.id,
      changes: {
        ...chatToUpdate,
        messages: messagesAdapter.removeOne(id, chatToUpdate.messages),
      },
    };
    const updatedChatsState = chatAdapter.updateOne(updatedChat, state.chats);
    return {...state, chats: updatedChatsState};
  }),
  on(addChatMessageAction, (state, {message, tokens}) => {
    const currentChat = state.chats.entities[state.currentChatId];
    let updatedMessagesEntities = messagesAdapter.addOne(message, (currentChat as Chat).messages);

    if (currentChat) {
      updatedMessagesEntities = messagesAdapter.addOne(message, currentChat.messages);

      const updatedChat: Chat = {
        ...currentChat,
        messages: updatedMessagesEntities,
        tokens: tokens?.total_tokens ? tokens?.total_tokens : currentChat.tokens,
        name:
          !currentChat.isRenamed && updatedMessagesEntities.ids.length === 2
            ? createChatNameFromAnswer(message.content)
            : currentChat.name,
      };

      return {
        ...state,
        chats: chatAdapter.updateOne({id: state.currentChatId, changes: updatedChat}, state.chats),
      };
    }

    return state;
  }),
  on(clearMessagesUpdatedStatusAction, (state) => {
    const currentChat = state.chats.entities[state.currentChatId];
    if (currentChat) {
      const updatedMessages = currentChat.messages.ids
        .map((id) => currentChat.messages.entities[id])
        .filter((msg) => msg?.isChanged)
        .map((msg) => ({...msg, isChanged: false}));

      const updatedMessagesEntities = messagesAdapter.updateMany(
        updatedMessages.map((msg) => ({id: msg?.id as string, changes: msg})),
        currentChat.messages,
      );

      const updatedChat: Chat = {
        ...currentChat,
        messages: updatedMessagesEntities,
      };

      return {
        ...state,
        chats: chatAdapter.updateOne({id: state.currentChatId, changes: updatedChat}, state.chats),
      };
    }

    return state;
  }),
  // on(updateChatTokensAction, (state, {tokens}) => {
  //   const currentChat = state.chats.entities[state.currentChatId];
  //   if (currentChat) {
  //     const updatedChat = chatAdapter.updateOne(
  //       {id: state.currentChatId, changes: {tokens: tokens.total_tokens}},
  //       state.chats,
  //     );
  //     return {...state, updatedChat};
  //   }
  //   return {...state};
  // }),
  on(changeChatModelAction, (state, {modelId}) => {
    return {
      ...state,
      lastSelectedModelId: modelId,
    };
  }),
  on(addNewModelAction, (state, {newModels}) => {
    return {
      ...state,
      models: [...state.models, ...newModels],
    };
  }),
  on(deleteAddedModelAction, (state, {id}) => {
    return {
      ...state,
      models: state.models.filter((model) => model.id !== id),
    };
  }),
);

export const chatFeatureKey = 'chat';
