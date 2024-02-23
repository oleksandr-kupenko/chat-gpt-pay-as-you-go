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
import {EditableFieldInputComponent} from '../../../../shared/components/editable-field-input/editable-field-input.component';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [
    MatIconModule,
    AsyncPipe,
    RouterModule,
    MatMenuModule,
    BackdropDirective,
    FormsModule,
    AutoFocusDirective,
    EditableFieldInputComponent,
  ],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent implements OnInit {
  @Output() closeChatsList = new EventEmitter<void>();
  @Input() isShowCloseBtn = false;

  public chatsList$!: Observable<Chat[]>;

  private currentChangedChatId: string | null = null;

  constructor(private store: Store) {}

  ngOnInit() {
    this.chatsList$ = this.store.pipe(
      select(chatsListSelector),
      map((chatsEntities) => {
        return chatsEntities;
      }),
    );
  }

  public handleRenameChat(id: string) {
    this.store.dispatch(editChatNameAction({id, isEditable: true}));
  }

  public handleDeleteChat(id: string) {
    this.store.dispatch(deleteChatAction({id}));
  }

  public handleCloseEditNameMode(newText: {id: string; value: string | null; wasChanged: boolean}) {
    if (newText.wasChanged) {
      this.store.dispatch(saveNewChatNameAction({id: newText.id, newName: newText.value as string}));
    } else {
      this.store.dispatch(editChatNameAction({id: newText.id, isEditable: false}));
    }
  }
}
