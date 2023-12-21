import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppService} from "./app.service";
import {GPT_MODEL, Message, ROLE} from "./app.interface";
import {finalize, Subscription} from "rxjs";
import {messagesMock} from "./app.mock";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChildren("messageRef") messageElList!: QueryList<ElementRef>;

  public isLoading = signal(false);

  public ROLE = ROLE;

  public chatForm!: FormGroup;
  public settingsForm!: FormGroup;

  public models: {value: string; viewValue: string}[] = [
    {value: GPT_MODEL.GPT_35, viewValue: "GPT-3.5"},
    {value: GPT_MODEL.GPT_4, viewValue: "GPT-4"},
  ];

  public messages: Message[] = messagesMock;
  public currentKey = signal("");

  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
  ) {}

  ngOnInit() {
    this.getApiKey();

    this.initForm();
    this.initSettingsForm();
  }

  ngAfterViewInit() {
    this.subscribeToMessagesEl();
  }

  public handleSend() {
    if (this.chatForm.valid) {
      this.isLoading.set(true);
      const model = this.chatForm.value.model.value;
      this.appService.setRequestHeaders(this.chatForm.value.key);

      const message: Message = {role: ROLE.user, content: this.chatForm.value.question};
      this.messages.push(message);
      this.chatForm.patchValue({question: ""});
      this.appService
        .postQuestion({model, messages: this.messages})
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe((data) => {
          this.messages.push(data.choices[0].message);
          setTimeout(() => {
            this.messageElList.last.nativeElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
          }, 100);

          console.log("DATA", this.messages);
        });
      this.isLoading.set(false);
    }
  }

  public handleSaveSettings() {
    const key = this.settingsForm.value.key;
    this.currentKey.set(key);
    this.appService.saveKey(key);
  }

  public handleDeleteKey() {
    this.currentKey.set("");
    this.appService.deleteKey();
    this.settingsForm.patchValue({key: ""});
  }

  public handleKeyInput() {
    this.settingsForm.get("key")?.markAsTouched();
  }

  private initForm() {
    this.chatForm = this.fb.group({
      model: [this.models[0], Validators.required],
      question: ["", [Validators.required]],
    });
  }

  private initSettingsForm() {
    this.settingsForm = this.fb.group({
      key: [this.currentKey(), Validators.required],
    });
  }

  private subscribeToMessagesEl() {
    this.subs.add(
      this.messageElList.changes.subscribe(() => {
        this.messageElList.last.nativeElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      }),
    );
  }

  private getApiKey() {
    this.currentKey.set(this.appService.getKey() || "");
  }
}
