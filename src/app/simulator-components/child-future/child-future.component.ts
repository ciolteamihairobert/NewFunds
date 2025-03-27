import { Component } from '@angular/core';
import { HeaderComponent } from '../../reusable-components/header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-child-future',
  standalone: true,
  imports: [HeaderComponent,  MatFormFieldModule,
    MatInputModule,FormsModule,  CommonModule, 
    ReactiveFormsModule, MatGridListModule,
    ],
  templateUrl: './child-future.component.html',
  styleUrl: '../simulatorStyles.css'
})
export class ChildFutureComponent {

}
