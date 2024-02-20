import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
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
import {Observable, of, Subscription, switchMap, take, tap} from 'rxjs';
import {SettingsBtnComponent} from '../../shared/components/settings-btn/settings-btn.component';
import {convertToHtml, createId} from '../../utils';
import {SafeMarkedPipe} from '../../shared/pipes/marked.pipe';
import {HttpClientModule} from '@angular/common/http';
import {select, Store} from '@ngrx/store';
import {
  changeChatModelAction,
  initCurrentChatAction,
  addChatMessageAction,
  getAnswerAction,
  createNewChatAction,
} from './state/chat.actions';
import {currentChatSelector} from './state/chat.selectors';
import {AsyncPipe} from '@angular/common';
import {MessagesComponent} from './components/messages/messages.component';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {ChatsListComponent} from './components/chats-list/chats-list.component';
import {removeMessageId} from './chat.utils';

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
export class ChatComponent implements OnInit, OnDestroy {
  public isLoading = signal(false);
  public isShowChatsListBtn = signal(true);
  public messages: WritableSignal<Message[]> = signal([]);

  public isChatsListOpened = signal(false);

  protected readonly ROLE = ROLE;

  public chatForm!: FormGroup;

  private currentChatId!: string;

  private windowWidth = window.innerWidth;

  private subs = new Subscription();
  private currentMessagesSub?: Subscription;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    console.log('init');
    const chatResolverData = this.route.snapshot.data;
    if (chatResolverData) {
    }

    this.checkNeedShowChatListBtn();
    this.initForm();
    this.subscribeToRouteChanges();
  }

  ngOnDestroy() {
    if (this.currentMessagesSub) {
      this.currentMessagesSub.unsubscribe();
    }
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
      if (!this.currentChatId) {
        const id = createId();
        this.store.dispatch(createNewChatAction({id}));
        this.redirectToNewChat(id);
        this.store.dispatch(initCurrentChatAction({id}));
      }

      this.isLoading.set(true);

      const message: Message = {role: ROLE.user, content: convertToHtml(this.chatForm.value.question), id: createId()};
      this.chatForm.patchValue({question: ''});
      this.store.dispatch(addChatMessageAction({message}));

      const model = this.chatForm.value.model.value;
      this.store.dispatch(
        getAnswerAction({requestData: {model, messages: removeMessageId([...this.messages(), message])}}),
      );
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

  private subscribeToRouteChanges() {
    this.subs.add(
      this.route.params
        .pipe(
          switchMap((params) => {
            this.currentChatId = params['id'];
            if (this.currentChatId) {
              this.store.dispatch(initCurrentChatAction({id: this.currentChatId}));
              return this.store.select(currentChatSelector(this.currentChatId));
            } else {
              return of(undefined);
            }
          }),
        )
        .subscribe((chat) => {
          if (!chat) {
            this.router.navigate(['/chat']);
            const id = 'new';
            this.currentChatId = id;
            this.store.dispatch(createNewChatAction({id}));
            this.store.dispatch(initCurrentChatAction({id}));
          } else {
            this.messages.set(chat?.messages.ids.map((id) => chat?.messages.entities[id] as Message));
          }
        }),
    );
  }

  private checkNeedShowChatListBtn() {
    this.isChatsListOpened.set(this.windowWidth > 576);
    this.isShowChatsListBtn.set(this.windowWidth < 576);
  }

  private redirectToNewChat(id: string) {
    this.router.navigate(['/chat', id]);
  }
}
