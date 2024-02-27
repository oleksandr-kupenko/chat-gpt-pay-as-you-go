import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Model} from '../../../../app.interface';
import {addNewModelAction, changeChatModelAction, deleteAddedModelAction} from '../../state/chat.actions';
import {Store} from '@ngrx/store';
import {AddNewModelModalComponent} from '../add-new-model-modal/add-new-model-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {createId} from '../../../../utils';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-model-select',
  standalone: true,
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './model-select.component.html',
  styleUrl: './model-select.component.scss',
})
export class ModelSelectComponent implements OnChanges {
  @Input() public models!: Model[] | null;
  @Input() public selectedModelId!: string | null;

  @Input() modelFormControl!: FormControl<Model>;
  @Output() modelFormControlChange = new EventEmitter<FormControl<Model>>();

  public selectedModel!: Model;

  constructor(
    private store: Store,
    private dialog: MatDialog,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['selectedModelId'] || changes['models']) && this.models) {
      console.log('MODEL 1', this.selectedModelId);
      const model = this.models.find((model) => model.id === this.selectedModelId) || this.models[0];
      console.log('MODEL 2', this.selectedModelId);
      this.modelFormControl.setValue(model);
    }
  }

  public handleModelChange() {
    this.store.dispatch(changeChatModelAction({modelId: this.modelFormControl.value.id}));
  }

  public handleAddNewModel() {
    const dialogRef = this.dialog.open(AddNewModelModalComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newModel: Model = {model: result.model, name: result.name, isCustom: true, id: createId()};
        this.store.dispatch(addNewModelAction({newModels: [newModel]}));
      }
    });
  }

  public handleDeleteModel(id: string) {
    this.store.dispatch(deleteAddedModelAction({id}));
  }
}
