import {createAction, props} from '@ngrx/store';
import {Chat, ChatEntities, GPT_MODEL, Message, RequestData} from '../../../app.interface';

export const initChatsAction = createAction(
  '[[Chat Page] Init Chats',
  props<{lastSelectedModel: GPT_MODEL | string; chats: ChatEntities}>(),
);
export const initCurrentChatAction = createAction('[Chat Page] Init Current Chat', props<{id: string}>());
export const addChatMessageAction = createAction('[Chat Page] Add Chat Message', props<{message: Message}>());
export const getAnswerAction = createAction('[Chat Page] Get Answer', props<{requestData: RequestData}>());
export const changeChatModelAction = createAction('[Chat Page] Change Model', props<{model: GPT_MODEL}>());

export const chatNotFound = createAction('[Chat Page] Chat Not Found');

export const createNewChatAction = createAction('[Chat Page] Create new chat', props<{id: string}>());
export const deleteChatAction = createAction('[Chat Page] Delete chat', props<{id: string}>());

export const chatAnswerLoadedAction = createAction('[Chat Page] Answer Loaded');
export const chatAnswerFailedAction = createAction('[Chat Page] Answer Failed');

export const saveChatsAction = createAction('[Chat Page] Save Chats');
export const chatsSavedAction = createAction('[Chat Page] Chats Saved Successful');
