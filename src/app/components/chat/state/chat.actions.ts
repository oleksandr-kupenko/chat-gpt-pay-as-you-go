import {createAction, props} from '@ngrx/store';
import {Chat, GPT_MODEL, Message, RequestData} from '../../../app.interface';

export const initChatAction = createAction('[Chat Page] Init', props<{id: string}>());
export const addChatMessageAction = createAction('[Chat Page] Add Chat Message', props<{message: Message}>());
export const getAnswerAction = createAction('[Chat Page] Get Answer', props<{requestData: RequestData}>());
export const changeChatModelAction = createAction('[Chat Page] Change Model', props<{model: GPT_MODEL}>());

export const createNewChatAction = createAction('[Chat Page] Create new chat');
export const chatAnswerLoaded = createAction('[Chat Page] Answer Loaded');
export const chatAnswerFailed = createAction('[Chat Page] Answer Failed');
