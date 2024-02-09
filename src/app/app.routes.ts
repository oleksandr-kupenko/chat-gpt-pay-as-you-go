import {Routes} from '@angular/router';
import {ChatComponent} from './components/chat/chat.component';

export const routes: Routes = [
  {path: '', redirectTo: 'chat/0', pathMatch: 'full'},
  {path: 'chat', redirectTo: 'chat/0', pathMatch: 'full'},
  {path: 'chat/:id', component: ChatComponent},
];
