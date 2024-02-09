import {Actions, createEffect, ofType} from '@ngrx/effects';
import {inject} from '@angular/core';
import {ChatService} from '../chat.service';
import {addChatMessageAction, chatAnswerFailed, chatAnswerLoaded, getAnswerAction} from './chat.actions';
import {concatMap, map, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {addIdToMessage} from '../chat.utils';

export const loadAnswer = createEffect(
  (actions$ = inject(Actions), chatService = inject(ChatService)) => {
    return actions$.pipe(
      ofType(getAnswerAction),
      concatMap(({requestData}) => chatService.postQuestion(requestData)),
      map((response) => {
        const message = response.choices[0].message;
        return addChatMessageAction({message: addIdToMessage(message)});
      }),
      catchError((error: {message: string}) => of(chatAnswerFailed())),
    );
  },
  {functional: true},
);
