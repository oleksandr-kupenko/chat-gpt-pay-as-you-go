import {AfterViewInit, Component, ElementRef, Input, OnDestroy, QueryList, signal, ViewChildren} from '@angular/core';
import {Chat, Message, ROLE} from '../../../../app.interface';
import {AsyncPipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {SafeMarkedPipe} from '../../../../shared/pipes/marked.pipe';
import {Subscription} from 'rxjs';

declare const hljs: any;
@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [AsyncPipe, MatIconModule, SafeMarkedPipe],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements AfterViewInit, OnDestroy {
  @Input() messages!: Message[];

  @ViewChildren('messageRef') messageElList!: QueryList<ElementRef>;

  protected readonly ROLE = ROLE;

  private subs = new Subscription();

  ngAfterViewInit() {
    this.subscribeToMessagesEl();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private subscribeToMessagesEl() {
    this.subs.add(
      this.messageElList.changes.subscribe(() => {
        this.messageElList.last?.nativeElement.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
        hljs.highlightAll();
      }),
    );
  }
}
