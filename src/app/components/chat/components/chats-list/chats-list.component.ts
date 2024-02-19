import {Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {Chat} from '../../../../app.interface';
import {select, Store} from '@ngrx/store';
import {map, Observable} from 'rxjs';
import {chatsListSelector} from '../../state/chat.selectors';
import {AsyncPipe} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {deleteChatAction} from '../../state/chat.actions';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [MatIconModule, AsyncPipe, RouterModule, MatMenuModule],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent implements OnInit {
  @Output() closeChatsList = new EventEmitter<void>();
  @Input() isShowCloseBtn = false;

  public chatsList$!: Observable<Chat[]>;

  private currentChangedChatId: string | null = null;

  constructor(
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit() {
    this.chatsList$ = this.store.pipe(
      select(chatsListSelector),
      map((chatsEntities) => {
        return chatsEntities;
      }),
    );
  }

  public setCurrentChangedChatId(id: string) {
    this.currentChangedChatId = id;
  }

  public handleRenameChat() {
    console.log(this.currentChangedChatId);
  }

  public handleDeleteChat() {
    this.store.dispatch(deleteChatAction({id: this.currentChangedChatId as string}));
  }
}
