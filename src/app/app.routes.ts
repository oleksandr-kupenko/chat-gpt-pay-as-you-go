import {Routes} from '@angular/router';
import {ChatComponent} from './components/chat/chat.component';
import {ChatResolver} from './components/chat/chat.resolver';

export const routes: Routes = [
  {path: '', redirectTo: 'chat/0', pathMatch: 'full'},
  {path: 'chat', component: ChatComponent, resolve: {chats: ChatResolver}},
  {path: 'chat/:id', component: ChatComponent, resolve: {chats: ChatResolver}},
];
