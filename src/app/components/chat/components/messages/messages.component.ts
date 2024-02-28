import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  signal,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import {Chat, Message, ROLE} from '../../../../app.interface';
import {AsyncPipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {SafeMarkedPipe} from '../../../../shared/pipes/marked.pipe';
import {Subscription} from 'rxjs';
import {MatMenuModule} from '@angular/material/menu';
import {EditableFieldInputComponent} from '../../../../shared/components/editable-field-input/editable-field-input.component';
import {deleteChatMessageAction, editMessageContentAction, saveNewMessageAction} from '../../state/chat.actions';
import {Store} from '@ngrx/store';
import {MatTooltipModule} from '@angular/material/tooltip';
import {HighlightJsDirective, HighlightJsModule} from 'ngx-highlight-js';

declare const hljs: any;
@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    AsyncPipe,
    MatIconModule,
    SafeMarkedPipe,
    MatMenuModule,
    EditableFieldInputComponent,
    MatTooltipModule,
    HighlightJsModule,
    HighlightJsDirective,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements AfterViewInit, OnDestroy {
  @Input() messages!: Message[];

  @ViewChildren('messageRef') messageElList!: QueryList<ElementRef>;

  public highlightedMessageIdx: number | null = null;

  protected readonly ROLE = ROLE;

  private subs = new Subscription();

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit() {
    this.subscribeToMessagesEl();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public handleHighlightMessage(index: number) {
    this.highlightedMessageIdx = index;
  }

  public cancelHighlightMessage() {
    this.highlightedMessageIdx = null;
  }

  public handleEditMessage(id: string) {
    this.store.dispatch(editMessageContentAction({id, isEditable: true}));
    this.highlightedMessageIdx = null;
  }

  public handleDeleteMessage(id: string) {
    this.store.dispatch(deleteChatMessageAction({id}));
    this.highlightedMessageIdx = null;
  }

  public handleCloseEditNameMode(newText: {id: string; value: string | null; wasChanged: boolean}) {
    if (newText.wasChanged) {
      this.store.dispatch(saveNewMessageAction({id: newText.id, newContent: newText.value as string}));
    } else {
      this.store.dispatch(editMessageContentAction({id: newText.id, isEditable: false}));
    }
    this.highlightedMessageIdx = null;
    hljs.highlightAll();
  }

  public isContainCode(message: string) {
    return message.includes('```');
  }

  private subscribeToMessagesEl() {
    this.subs.add(
      this.messageElList.changes.subscribe(() => {
        this.messageElList.last?.nativeElement.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
      }),
    );
  }
}
