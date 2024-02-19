import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {inject} from '@angular/core';
import {Observable, of, switchMap, take, tap} from 'rxjs';
import {AppService} from '../../app.service';
import {chatStateSelector} from './state/chat.selectors';
import {initChatsAction} from './state/chat.actions';
import {transformChatsToChatsState} from './chat.utils';
import {ChatWithMessagesArr, GPT_MODEL} from '../../app.interface';

export const ChatResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> => {
  const store = inject(Store);
  const appService = inject(AppService);
  return store.pipe(
    select(chatStateSelector),
    take(1),
    switchMap((chatState) => {
      if (chatState.chats.ids.length) {
        return of(chatState);
      } else {
        return appService.initConfig().pipe(
          tap((newData) =>
            store.dispatch(
              initChatsAction({
                lastSelectedModel: newData?.chat.lastSelectedModel || GPT_MODEL.GPT_35,
                chats: transformChatsToChatsState(newData?.chat.chats as ChatWithMessagesArr[]),
              }),
            ),
          ),
        );
      }
    }),
  );
};
