import { Component } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ChangeDetectionStrategy, inject} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormDataService } from '../../../reusable-components/services/form-data.service';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatDialogModule, MatDialogModule, FormsModule,
    ReactiveFormsModule, CommonModule , MatFormFieldModule, MatInputModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
   public modalForm: FormGroup<any> = new FormGroup<any>({});
   public n: number = 20;
  
   constructor(
    private fb: FormBuilder,
    public modalDataService: FormDataService) {
   }

   ngOnInit(): void {
    this.initForm();
    this.modalDataService.setFormValuesFromSessionStorage('Modal', this.modalForm);
    this.modalForm.valueChanges.subscribe(() => {
      this.modalDataService.setForm(this.modalForm);
    });
  }

  initForm() {
    this.modalForm = this.fb.group({
      rows: this.fb.array([])
    });

    this.populateRows(this.n);
  }

  get rows(): FormArray {
    return this.modalForm.get('rows') as FormArray;
  }

  populateRows(n: number) {
    this.rows.clear();

    for (let i = 0; i < n; i++) {
      this.rows.push(this.createRow(i + 1));
    }
  }

  createRow(index: number): FormGroup {
    return this.fb.group({
      label: index,
      topUp: [''],
      withdrawals: ['']
    });
  }
}


