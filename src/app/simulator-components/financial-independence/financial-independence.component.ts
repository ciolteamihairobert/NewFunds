import { Component } from '@angular/core';
import { HeaderComponent } from '../../reusable-components/header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormDataService } from '../../reusable-components/services/form-data.service';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-financial-independence',
  standalone: true,
  imports: [HeaderComponent,  MatFormFieldModule,
  MatInputModule,FormsModule,  CommonModule, 
  ReactiveFormsModule, MatGridListModule,
  ],
  templateUrl: './financial-independence.component.html',
  styleUrl: '../simulatorStyles.css'
})
export class FinancialIndependenceComponent {
 public clientInfoForm: FormGroup<any> = new FormGroup<any>({});
 income: number = 0;
 rentalYield: Number = 0;

}
