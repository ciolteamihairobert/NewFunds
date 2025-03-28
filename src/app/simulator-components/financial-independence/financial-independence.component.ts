import { Component } from '@angular/core';
import { HeaderComponent } from '../../reusable-components/header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
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
 public income: number = 0;
 public rentalYield: Number = 0;
 public concept1 = {
  title: 'Varianta 1 de folosire a Conceptului',
  description: 'Aveti posiblitatea ca sumele primite la finalul contractului sa le utilizati pentru a va putea genera in continuare profituri si venituri pasive, astfel va veti putea bucura mai mult de aspectele ce conteaza pentru dumneavoastra. In plus, suma din cont poate fi lasata mostenire.',
  contentItems: [
    { text: 'Astfel, la varsta de x ani valoarea contului dumneavoastra va fi de', value: 'Z EURO' },
    { text: 'Veniturile pasive totale pe perioada de x ani, sunt de', value: 'Z EURO' },
    { text: 'Venitul pasiv lunar primit in aceasta perioada este de', value: 'Z EURO' },
    { text: 'Beneficiul total, calculat ca suma dintre veniturile pasive primite de catre dumneavoastra si mostenirea lasata familiei, este de', value: 'Z EURO' },
  ],
};
 public concept2 = {
  title: 'Varianta 2 de folosire a Conceptului',
  description: 'O alta posibilitate de utilizare a acestui concept este aceea de a genera venituri pasive atat din randamente cat si din sumele din cont. Astfel, avantajul este ca suma pe care o veti primi lunar va fi mai mare, dar livrandu-se catre dumneavoastra toate sumele din cont, la final nu vor mai ramane bani pentru mostenire.',
  contentItems: [
    { text: 'Veniturile pasive totale pe perioada de x ani, sunt de', value: 'Z EURO' },
    { text: 'Venitul pasiv lunar primit in aceasta perioada este de', value: 'Z EURO' },
  ],
};
}
