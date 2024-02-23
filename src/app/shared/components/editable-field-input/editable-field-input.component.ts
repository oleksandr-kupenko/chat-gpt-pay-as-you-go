import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AutoFocusDirective} from '../../directives/autofocus.directive';
import {BackdropDirective} from '../../directives/backdrop.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-editable-field-input',
  standalone: true,
  imports: [AutoFocusDirective, BackdropDirective, ReactiveFormsModule, FormsModule],
  templateUrl: './editable-field-input.component.html',
  styleUrl: './editable-field-input.component.scss',
})
export class EditableFieldInputComponent implements OnInit, OnDestroy {
  @Input() isTextArea = false;
  @Input() prevEditedText: string | null = null;
  @Input() entityId!: string;
  @Output() onTextChanged = new EventEmitter<{id: string; value: string | null; wasChanged: boolean}>();

  public editedNewText?: string | null;

  ngOnInit() {
    this.editedNewText = this.prevEditedText;
  }

  ngOnDestroy() {}

  public handleSendNewText() {
    if (this.editedNewText && this.editedNewText !== this.prevEditedText) {
      this.onTextChanged.emit({id: this.entityId, value: this.editedNewText, wasChanged: true});
    } else {
      this.onTextChanged.emit({id: this.entityId, value: this.prevEditedText, wasChanged: false});
    }
  }
}
