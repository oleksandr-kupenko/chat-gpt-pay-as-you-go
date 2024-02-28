import {Component, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {Chat, Message, Model, ROLE} from '../../app.interface';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {TextFieldModule} from '@angular/cdk/text-field';
import {Observable, of, Subscription, switchMap} from 'rxjs';
import {SettingsBtnComponent} from '../../shared/components/settings-btn/settings-btn.component';
import {createId} from '../../utils';
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
import {
  currentChatSelector,
  currentModelIdSelector,
  modelsSelector,
  someMessageEditedSelector,
} from './state/chat.selectors';
import {AsyncPipe} from '@angular/common';
import {MessagesComponent} from './components/messages/messages.component';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {ChatsListComponent} from './components/chats-list/chats-list.component';
import {removeAdditionalFields} from './chat.utils';
import {TooltipWithHtmlModule} from '../../shared/directives/tooltip-with-html/tooltip-with-html.module';
import {DEFAULT_MODELS} from './chat.constants';
import {ModelSelectComponent} from './components/model-select/model-select.component';
import {MatTooltipModule} from '@angular/material/tooltip';

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
    TooltipWithHtmlModule,
    ModelSelectComponent,
    MatTooltipModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  public isLoading = signal(false);
  public isShowChatsListBtn = signal(true);
  public messages: WritableSignal<Message[]> = signal([]);
  public totalTokens: WritableSignal<number> = signal(0);

  public isChatsListOpened = signal(false);

  public isSomeMessageUpdated$!: Observable<boolean>;

  public modelHelpText = `<img alt="GPT models" src="assets/img/models-help.webp">
<a class="custom-tooltip__href" href="https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo" target="_blank">Models list</a>`;

  protected readonly ROLE = ROLE;

  public chatForm!: FormGroup;

  public modelChatId!: Observable<string>;

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
    this.subscribeToModels();
    this.modelChatId = this.store.pipe(select(currentModelIdSelector));
    this.isSomeMessageUpdated$ = this.store.pipe(select(someMessageEditedSelector));
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

  public handleToggleChatsList(status: boolean) {
    this.isChatsListOpened.set(status);
  }

  public handleSend() {
    const message: Message = {role: ROLE.user, content: this.chatForm.value.question, id: createId()};
    const model = this.chatForm.value.model.model;

    if (this.chatForm.valid) {
      if (!this.currentChatId || this.currentChatId === 'new') {
        const id = createId();
        this.store.dispatch(createNewChatAction({id}));
        this.redirectToNewChat(id);
        this.store.dispatch(initCurrentChatAction({id}));
      }

      this.isLoading.set(true);

      this.chatForm.patchValue({question: ''});
      this.store.dispatch(addChatMessageAction({message}));

      this.store.dispatch(
        getAnswerAction({requestData: {model, messages: removeAdditionalFields([...this.messages(), message])}}),
      );
      this.isLoading.set(false);
    } else if (!this.chatForm.value.question) {
      this.store.dispatch(
        getAnswerAction({requestData: {model, messages: removeAdditionalFields([...this.messages()])}}),
      );
    }
  }

  public models!: Observable<Model[]>;

  private initForm() {
    this.chatForm = this.fb.group({
      question: ['', [Validators.required]],
      model: [DEFAULT_MODELS[0], [Validators.required]],
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
            this.totalTokens.set(chat.tokens);
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

  private subscribeToModels() {
    this.models = this.store.pipe(select(modelsSelector));
  }
}
