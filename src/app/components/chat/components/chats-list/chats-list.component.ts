import {Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {Chat} from '../../../../app.interface';
import {createEmptyChat} from '../../chat.utils';

@Component({
  selector: 'app-chats-list',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './chats-list.component.html',
  styleUrl: './chats-list.component.scss',
})
export class ChatsListComponent implements OnInit {
  @Output() closeChatsList = new EventEmitter<void>();
  @Input() isShowCloseBtn = false;

  public chatsList: WritableSignal<Chat[]> = signal([]);

  ngOnInit() {
    this.chatsList.set([createEmptyChat(), createEmptyChat()]);
  }
}
