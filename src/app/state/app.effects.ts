import {Actions, createEffect, ofType} from '@ngrx/effects';
import {inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {chatAnswerFailedAction} from '../components/chat/state/chat.actions';
import {concatMap, map, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AppService} from '../app.service';
import {configInited, initConfigAction} from './app.actions';

export const initConfig = createEffect(
  (actions$ = inject(Actions), appService = inject(AppService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(initConfigAction),
      concatMap(() => appService.initConfig()),
      map((config) => {
        console.log('DATA 123', config);
        return configInited({config: config});
      }),
      catchError((error: {message: string}) => of(chatAnswerFailedAction())),
    );
  },
  {functional: true},
);
