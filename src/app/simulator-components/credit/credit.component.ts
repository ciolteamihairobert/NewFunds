import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CreditTableRow } from './models/creditTable';
import { CreditDataService } from './services/credit-data.service';
import { ToastrModule } from 'ngx-toastr';
import { HeaderComponent } from '../../reusable-components/header/header.component';
import { FormDataService } from '../../reusable-components/services/form-data.service';
import { creditSim_displayedColumns, creditSim_repaymentMethods } from '../constants';
import { SimulationStateService } from '../../side-menu/services/simulation-state.service';
import { ExportService } from '../../reusable-components/services/export-data.service';

@Component({
  selector: 'app-credit',
  standalone: true,
  imports: [HeaderComponent, CommonModule,
    MatInputModule, MatFormFieldModule,
    MatSelectModule, FormsModule,
    ReactiveFormsModule, ToastrModule,
    MatTableModule, MatPaginatorModule],
  templateUrl: './credit.component.html',
  styleUrl: '../simulatorStyles.css'
})

export class CreditComponent implements OnInit {
  public repaymentMethods = creditSim_repaymentMethods;
  public displayedColumns = creditSim_displayedColumns;
  public months: string[] = Array.from({ length: 41 }, (_, i) => (i * 3).toString());
  public dataSource = new MatTableDataSource<CreditTableRow>([]);
  public creditForm: FormGroup<any> = new FormGroup<any>({});
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public creditSim_totalToPay: number = 0;
  public creditSim_totalPeriod: number = 0;

  constructor(
    private fb: FormBuilder,
    public formDataService: FormDataService,
    private creditDataService: CreditDataService,
    private exportService: ExportService,
    private simulationStateService: SimulationStateService) {
      this.creditForm = this.fb.group({
        creditSim_loanAmount: ['', Validators.required],
        creditSim_contractingMoment: ['', Validators.required],
        creditSim_repaymentPeriod: ['', Validators.required],
        creditSim_repaymentMethod: ['', Validators.required],
        creditSim_monthlyEarlyRepayment: ['', Validators.required],
        creditSim_currentInterestRate: ['', Validators.required],
        creditSim_subsequentInterestRate: ['', Validators.required],
        creditSim_interestRateReviewPeriod: ['', Validators.required],
        creditSim_monthlyCommission: ['', Validators.required],
        creditSim_gracePeriod: ['', Validators.required],
      });
  }

  ngOnInit(): void {
    this.formDataService.setFormValuesFromSessionStorage('Credit',this.creditForm);
    this.creditForm.valueChanges.subscribe(() => {
        this.formDataService.setForm(this.creditForm);
    });
    this.creditDataService.currentCreditRows$.subscribe(rows => {
      this.dataSource.data = rows;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }); 
    });
    this.creditDataService.creditTotalPeriod$.subscribe(totalPeriod => {
      this.creditSim_totalPeriod = totalPeriod;
    });
    this.creditDataService.creditTotalCostToPay$.subscribe(totalToPay => {
      this.creditSim_totalToPay = totalToPay;
    });
  }

  public exportToExcel(): void {
    const formData = this.creditForm.value;
    const inputData: any[][] = [
      ['Datele Initiale'],
      ['Suma imprumutata', formData['creditSim_loanAmount']],
      ['Momentul contractarii (dupa ... luni)', formData['creditSim_contractingMoment']],
      ['Perioada de rambursare (Luni)', formData['creditSim_repaymentPeriod']],
      ['Modul de rambursare', this.repaymentMethods[formData['creditSim_repaymentMethod']].viewValue],
      ['Rambursare anticipata lunara (Ron)', formData['creditSim_monthlyEarlyRepayment']],
      ['Rata dobanzii actuale (%)', formData['creditSim_currentInterestRate']],
      ['Rata dobanzii ulterioare (%)', formData['creditSim_subsequentInterestRate']],
      ['Revizuirea ratei dobanzii (Luni)', formData['creditSim_interestRateReviewPeriod']],
      ['Comision lunar (%)', formData['creditSim_monthlyCommission']],
      ['Perioada de gratie (Luni)', formData['creditSim_gracePeriod']],
    ];
  
    const summaryData = [
      ['Creditul se poate inchide in:', this.creditSim_totalPeriod + ' luni'],
      ['Totalul de rambursat este:', this.creditSim_totalToPay]
    ];
    
    const tableDisplayHeader= ['Luna', 'Sold Initial', 'Anuitate', 'Principal', 'Dobanda', 'Comision Lunar', 'Total Plata', 'Rambursare Anticipata'];
    const tableHeader = ['creditSim_luna', 'creditSim_soldInitial', 'creditSim_anuitate', 'creditSim_principal', 'creditSim_dobanda', 'creditSim_comisionLunar', 'creditSim_totalPlata', 'creditSim_rambursareAnticipata'];
    
    this.exportService.exportToExcel(this.dataSource.data, inputData, summaryData, tableHeader, tableDisplayHeader, 'Simulatare_De_Credit');
  }
  
  public exportToPDF(): void {
    const formData = this.creditForm.value;
    const inputData: any[][] = [
      ['Suma împrumutata (Ron)', formData['creditSim_loanAmount']],
      ['Momentul contractarii (dupa ... luni)', formData['creditSim_contractingMoment']],
      ['Perioada de rambursare (Luni)', formData['creditSim_repaymentPeriod']],
      ['Modul de rambursare', this.repaymentMethods[formData['creditSim_repaymentMethod']].viewValue],
      ['Rambursare anticipata lunara (Ron)', formData['creditSim_monthlyEarlyRepayment']],
      ['Rata dobanzii actuale (%)', formData['creditSim_currentInterestRate']],
      ['Rata dobanzii ulterioare (%)', formData['creditSim_subsequentInterestRate']],
      ['Revizuirea ratei dobanzii (Luni)', formData['creditSim_interestRateReviewPeriod']],
      ['Comision lunar (%)', formData['creditSim_monthlyCommission']],
      ['Perioada de gratie (Luni)', formData['creditSim_gracePeriod']]
    ];
  
    const summaryData = [
      ['Creditul se poate inchide in:', this.creditSim_totalPeriod + ' luni'],
      ['Totalul de rambursat este:', this.creditSim_totalToPay]
    ];
  
    const tableDisplayHeader = ['Luna', 'Sold Initial', 'Anuitate', 'Principal', 'Dobanda', 'Comision Lunar', 'Total Plata', 'Rambursare Anticipata'];
    const tableHeader = ['creditSim_luna', 'creditSim_soldInitial', 'creditSim_anuitate', 'creditSim_principal', 'creditSim_dobanda', 'creditSim_comisionLunar', 'creditSim_totalPlata', 'creditSim_rambursareAnticipata'];
  
    this.exportService.exportToPDF(this.dataSource.data, inputData, summaryData, tableHeader, tableDisplayHeader, 'Simulare de Credit');
  }

  public clearSimulation(): void {
    this.formDataService.clearSimulation(
      this.creditForm,
      this.dataSource,
      'creditSim_'
    );
    this.simulationStateService.updateCreditSimRunning(false);
  }
}
 