import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import {GPT_MODEL, Message, ROLE} from '../../app.interface';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {TextFieldModule} from '@angular/cdk/text-field';
import {finalize, Subscription} from 'rxjs';
import {ChatService} from './chat.service';
import {SettingsBtnComponent} from '../../shared/components/settings-btn/settings-btn.component';
import {convertToHtml} from '../../utils';
import {SafeMarkedPipe} from '../../shared/pipes/marked.pipe';
import {HttpClientModule} from '@angular/common/http';
import {messagesMock} from '../../app.mock';

declare const hljs: any;

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
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('messageRef') messageElList!: QueryList<ElementRef>;

  public isLoading = signal(false);
  protected readonly messages = signal<Message[]>([]);
  protected readonly ROLE = ROLE;

  public chatForm!: FormGroup;

  private subs = new Subscription();

  constructor(
    private chatService: ChatService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    this.messages.set(messagesMock);
    this.subscribeToMessagesEl();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public handleSend() {
    if (this.chatForm.valid) {
      this.isLoading.set(true);
      const model = this.chatForm.value.model.value;
      const message: Message = {role: ROLE.user, content: convertToHtml(this.chatForm.value.question)};
      this.messages.update((list) => [...list, message]);
      this.chatForm.patchValue({question: ''});
      this.chatService
        .postQuestion({model, messages: this.messages()})
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (data) => {
            this.messages.update((list) => [...list, data.choices[0].message]);
          },
          error: () => {
            this.messages.update((list) => {
              this.chatForm.patchValue({question: list.pop()?.content});
              this.messageElList.last.nativeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
              });
              return list;
            });
          },
        });
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

  private subscribeToMessagesEl() {
    this.subs.add(
      this.messageElList.changes.subscribe(() => {
        this.messageElList.last?.nativeElement.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
        hljs.highlightAll();
      }),
    );
  }
}
