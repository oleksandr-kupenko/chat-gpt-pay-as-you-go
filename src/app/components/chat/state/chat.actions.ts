import {createAction, props} from '@ngrx/store';
import {Chat, ChatEntities, Message, Model, RequestData, ResponseTokens} from '../../../app.interface';

export const initChatsAction = createAction(
  '[[Chat Page] Init Chats',
  props<{lastSelectedModelId: string; chats: ChatEntities; models: Model[]}>(),
);
export const initCurrentChatAction = createAction('[Chat Page] Init Current Chat', props<{id: string}>());
export const addChatMessageAction = createAction(
  '[Chat Page] Add Chat Message',
  props<{message: Message; tokens?: ResponseTokens}>(),
);

export const updateChatTokensAction = createAction('[Chat Page] Update Chat Tokens', props<{tokens: ResponseTokens}>());
export const getAnswerAction = createAction('[Chat Page] Get Answer', props<{requestData: RequestData}>());
export const changeChatModelAction = createAction('[Chat Page] Change Model', props<{modelId: string}>());

export const chatNotFound = createAction('[Chat Page] Chat Not Found');

export const clearMessagesUpdatedStatusAction = createAction('[Chat Page] Clear messages updated status');

export const createNewChatAction = createAction('[Chat Page] Create new chat', props<{id: string}>());
export const deleteChatAction = createAction('[Chat Page] Delete chat', props<{id: string}>());
export const editChatNameAction = createAction(
  '[Chat Page] Edit chat name',
  props<{id: string; isEditable: boolean}>(),
);

export const saveNewChatNameAction = createAction(
  '[Chat Page] Save new chat name',
  props<{id: string; newName: string}>(),
);

export const deleteChatMessageAction = createAction('[Chat Page] Delete chat message', props<{id: string}>());

export const editMessageContentAction = createAction(
  '[Chat Page] Edit message content',
  props<{id: string; isEditable: boolean}>(),
);

export const saveNewMessageAction = createAction(
  '[Chat Page] Save new message content',
  props<{id: string; newContent: string}>(),
);

export const chatAnswerLoadedAction = createAction('[Chat Page] Answer Loaded');
export const chatAnswerFailedAction = createAction('[Chat Page] Answer Failed');

export const saveChatsAction = createAction('[Chat Page] Save Chats');
export const chatsSavedAction = createAction('[Chat Page] Chats Saved Successful');

export const addNewModelAction = createAction('[Chat Page] Add New Model', props<{newModels: Model[]}>());

export const deleteAddedModelAction = createAction('[Chat Page] Delete Added Model', props<{id: string}>());
