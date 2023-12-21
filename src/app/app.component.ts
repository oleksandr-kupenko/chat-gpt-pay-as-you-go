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

  public form!: FormGroup;

  public models: {value: string; viewValue: string}[] = [
    {value: GPT_MODEL.GPT_35, viewValue: "GPT-3.5"},
    {value: GPT_MODEL.GPT_4, viewValue: "GPT-4"},
  ];

  public messages: Message[] = messagesMock;

  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    this.subscribeToMessagesEl();
  }

  public handleSend() {
    if (this.form.valid) {
      this.isLoading.set(true);
      const model = this.form.value.model.value;
      this.appService.setRequestHeaders(this.form.value.key);

      const message: Message = {role: ROLE.user, content: this.form.value.question};
      this.messages.push(message);
      this.form.patchValue({question: ""});
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

  private initForm() {
    this.form = this.fb.group({
      model: [this.models[0], Validators.required],
      question: ["", [Validators.required]],
      key: ["", Validators.required],
    });
  }

  private subscribeToMessagesEl() {
    this.subs.add(
      this.messageElList.changes.subscribe(() => {
        this.messageElList.last.nativeElement.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      }),
    );
  }
}
