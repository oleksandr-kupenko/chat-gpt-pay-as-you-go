import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AsyncPipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-model-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    AsyncPipe,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-new-model-modal.component.html',
  styleUrl: './add-new-model-modal.component.scss',
})
export class AddNewModelModalComponent implements OnInit {
  public newModelFormGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddNewModelModalComponent>,
  ) {}
  ngOnInit(): void {
    this.newModelFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      model: ['', [Validators.required]],
    });
  }

  public handleSubmitNewModel() {
    if (this.newModelFormGroup.valid) {
      this.dialogRef.close({
        name: this.newModelFormGroup.get('name')?.value,
        model: this.newModelFormGroup.get('model')?.value,
      });
    }
  }
}
