import { Component } from '@angular/core';
import { HeaderComponent } from '../../reusable-components/header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-child-future',
  standalone: true,
  imports: [HeaderComponent,  MatFormFieldModule,
    MatInputModule,FormsModule,  CommonModule, 
    ReactiveFormsModule, MatGridListModule,
    MatTableModule,
  ],
  templateUrl: './child-future.component.html',
  styleUrl: '../simulatorStyles.css'
})
export class ChildFutureComponent {
 public  displayedColumns: string[] = ['age', 'balance', 'withdrawals'];
 public dataSource = ELEMENT_DATA;  
}

const ELEMENT_DATA = [
  { age: '5 ani', balance: '10,000 EURO', withdrawals: '500 EURO' },
  { age: '10 ani', balance: '15,000 EURO', withdrawals: '700 EURO' },
  { age: '15 ani', balance: '20,000 EURO', withdrawals: '1,000 EURO' },
];
