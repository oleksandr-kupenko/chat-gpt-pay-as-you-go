import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {Chat, GPT_MODEL, Message, ROLE} from '../../app.interface';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {TextFieldModule} from '@angular/cdk/text-field';
import {Observable, of, Subscription, tap} from 'rxjs';
import {SettingsBtnComponent} from '../../shared/components/settings-btn/settings-btn.component';
import {convertToHtml, createId} from '../../utils';
import {SafeMarkedPipe} from '../../shared/pipes/marked.pipe';
import {HttpClientModule} from '@angular/common/http';
import {select, Store} from '@ngrx/store';
import {changeChatModelAction, initChatAction, addChatMessageAction, getAnswerAction} from './state/chat.actions';
import {currentChatSelector} from './state/chat.selectors';
import {AsyncPipe} from '@angular/common';
import {MessagesComponent} from './components/messages/messages.component';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {ChatsListComponent} from './components/chats-list/chats-list.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    HttpClientModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
    TextFieldModule,
    SettingsBtnComponent,
    SafeMarkedPipe,
    AsyncPipe,
    MessagesComponent,
    MatSidenavModule,
    ChatsListComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  public isLoading = signal(false);
  public isShowChatsListBtn = signal(true);
  public messages: WritableSignal<Message[]> = signal([]);

  public isChatsListOpened = signal(false);

  protected readonly ROLE = ROLE;

  public chatForm!: FormGroup;

  private currentChatId!: string;

  private windowWidth = window.innerWidth;

  private subs = new Subscription();

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.checkNeedShowChatListBtn();
    this.getCurrentChatId();
    this.store.dispatch(initChatAction({id: this.currentChatId}));
    this.initForm();
    this.store.pipe(select(currentChatSelector(this.currentChatId))).subscribe((chat) => {
      if (chat?.messages) {
        this.messages.set(chat?.messages);
      }
    });
  }

  public handleResize(event: any) {
    this.windowWidth = event.target.innerWidth;
    this.checkNeedShowChatListBtn();
  }

  public handleModelChange() {
    this.store.dispatch(changeChatModelAction(this.chatForm.value.model.value));
  }

  public handleToggleChatsList(status: boolean) {
    this.isChatsListOpened.set(status);
  }

  public handleSend() {
    if (this.chatForm.valid) {
      this.isLoading.set(true);
      const model = this.chatForm.value.model.value;
      const message: Message = {role: ROLE.user, content: convertToHtml(this.chatForm.value.question)};
      this.chatForm.patchValue({question: ''});
      this.store.dispatch(addChatMessageAction({message}));
      this.store.dispatch(getAnswerAction({requestData: {model, messages: this.messages()}}));

      // this.chatService
      //   .postQuestion({model, messages: this.messages()})
      //   .pipe(finalize(() => this.isLoading.set(false)))
      //   .subscribe({
      //     next: (data) => {
      //       this.messages.update((list) => [...list, data.choices[0].message]);
      //     },
      //     error: () => {
      //       this.messages.update((list) => {
      //         this.chatForm.patchValue({question: list.pop()?.content});
      //         this.messageElList.last.nativeElement.scrollIntoView({
      //           behavior: 'smooth',
      //           block: 'end',
      //           inline: 'nearest',
      //         });
      //         return list;
      //       });
      //     },
      //   });
      this.isLoading.set(false);
    }
  }

  public models: {value: string; viewValue: string}[] = [
    {value: GPT_MODEL.GPT_35, viewValue: 'GPT-3.5'},
    {value: GPT_MODEL.GPT_4, viewValue: 'GPT-4'},
  ];

  private initForm() {
    this.chatForm = this.fb.group({
      model: [this.models[0], Validators.required],
      question: ['', [Validators.required]],
    });
  }

  private getCurrentChatId() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id != null) {
      this.currentChatId = id;
    } else {
      this.currentChatId = createId();
      const navigationExtras: NavigationExtras = {
        queryParams: {id},
      };
      this.router.navigate([], navigationExtras);
    }
  }

  private checkNeedShowChatListBtn() {
    this.isChatsListOpened.set(this.windowWidth > 576);
    this.isShowChatsListBtn.set(this.windowWidth < 576);
    console.log();
  }
}
