import {Actions, createEffect, ofType} from '@ngrx/effects';
import {inject} from '@angular/core';
import {ChatService} from '../chat.service';
import {
  addChatMessageAction,
  addNewModelAction,
  chatAnswerFailedAction,
  chatsSavedAction,
  clearMessagesUpdatedStatusAction,
  deleteAddedModelAction,
  deleteChatAction,
  deleteChatMessageAction,
  getAnswerAction,
  saveNewChatNameAction,
  saveNewMessageAction,
} from './chat.actions';
import {concatMap, map, of, withLatestFrom} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {addIdToMessage} from '../chat.utils';
import {AppService} from '../../../app.service';
import {Store} from '@ngrx/store';
import {transformStateToConfig} from '../../../utils';

export const loadAnswer = createEffect(
  (actions$ = inject(Actions), chatService = inject(ChatService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(getAnswerAction),
      concatMap(({requestData}) => {
        return chatService.postQuestion(requestData);
      }),
      map((response) => {
        const message = response.choices[0].message;
        store.dispatch(clearMessagesUpdatedStatusAction());
        store.dispatch(chatsSavedAction());
        return addChatMessageAction({message: addIdToMessage(message)});
      }),
      catchError((error: {message: string}) => of(chatAnswerFailedAction())),
    );
  },
  {functional: true},
);

export const saveChats = createEffect(
  (actions$ = inject(Actions), appService = inject(AppService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(
        addChatMessageAction,
        deleteChatAction,
        saveNewChatNameAction,
        saveNewMessageAction,
        deleteChatMessageAction,
        addNewModelAction,
        deleteAddedModelAction,
      ),
      withLatestFrom(store),
      concatMap(([action, state]) => appService.saveChats(transformStateToConfig(state))),
      map((response) => {
        return chatsSavedAction();
      }),
    );
  },
  {functional: true},
);
