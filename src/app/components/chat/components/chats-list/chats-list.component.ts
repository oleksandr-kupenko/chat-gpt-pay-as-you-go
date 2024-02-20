import {Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {Chat} from '../../../../app.interface';
import {select, Store} from '@ngrx/store';
import {map, Observable} from 'rxjs';
import {chatsListSelector} from '../../state/chat.selectors';
import {AsyncPipe} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {deleteChatAction, editChatNameAction, saveNewChatNameAction} from '../../state/chat.actions';
import {BackdropDirective} from '../../../../shared/directives/backdrop.directive';
import {FormsModule} from '@angular/forms';
import {AutoFocusDirective} from '../../../../shared/directives/autofocus.directive';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [MatIconModule, AsyncPipe, RouterModule, MatMenuModule, BackdropDirective, FormsModule, AutoFocusDirective],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent implements OnInit {
  @Output() closeChatsList = new EventEmitter<void>();
  @Input() isShowCloseBtn = false;

  public chatsList$!: Observable<Chat[]>;

  public editedNewName?: string | null;
  private prevEditedName?: string | null;

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

  public setEditedChatData(id: string, name: string) {
    if (this.editedNewName) {
      this.handleCloseEditNameMode();
    }

    this.currentChangedChatId = id;
    this.prevEditedName = this.editedNewName = name;
  }

  public handleRenameChat() {
    console.log(this.currentChangedChatId);
    this.store.dispatch(editChatNameAction({id: this.currentChangedChatId as string, isEditable: true}));
  }

  public handleDeleteChat() {
    this.store.dispatch(deleteChatAction({id: this.currentChangedChatId as string}));
  }

  public handleCloseEditNameMode() {
    console.log('ok');
    if (this.editedNewName && this.editedNewName !== this.prevEditedName) {
      this.store.dispatch(
        saveNewChatNameAction({id: this.currentChangedChatId as string, newName: this.editedNewName}),
      );
    } else {
      this.store.dispatch(editChatNameAction({id: this.currentChangedChatId as string, isEditable: false}));
    }
    this.editedNewName = null;
    this.prevEditedName = null;
  }
}
