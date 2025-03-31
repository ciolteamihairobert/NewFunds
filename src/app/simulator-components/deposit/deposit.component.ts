import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import { HeaderComponent } from '../../reusable-components/header/header.component';
import { DepositTableRow } from './models/depositTable';
import { FormDataService } from '../../reusable-components/services/form-data.service';
import { DepositDataService } from './services/deposit-data.service';
import { depositSim_displayedColumns } from '../constants';
import { SimulationStateService } from '../../side-menu/services/simulation-state.service';
import { ExportService } from '../../reusable-components/services/export-data.service';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [HeaderComponent, CommonModule,
      MatInputModule, MatFormFieldModule,
      MatSelectModule, FormsModule,
      ReactiveFormsModule, ToastrModule,
      MatTableModule, MatPaginatorModule],
  templateUrl: './deposit.component.html',
  styleUrl: '../simulatorStyles.css'
})
export class DepositComponent implements OnInit {
  public displayedColumns = depositSim_displayedColumns;
  public dataSource = new MatTableDataSource<DepositTableRow>([]);
  public depositForm: FormGroup<any> = new FormGroup<any>({});
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public depositSim_totalSavings: number = 0;
  public depositSim_finalBalance: number = 0;
  public depositSim_profitability: number = 0;
  public depositSim_totalTaxPaid: number = 0;

  constructor(private fb: FormBuilder,
    public formDataService: FormDataService,
    private depositDataService: DepositDataService,
    private exportService: ExportService,
    private simulationStateService: SimulationStateService) {
      this.depositForm = this.fb.group({
        depositSim_initialAmount: ['', Validators.required],
        depositSim_monthlySaving: ['', Validators.required],
        depositSim_depositMaturity: ['', Validators.required],
        depositSim_savingDuration: ['', Validators.required],
        depositSim_annualInterest: ['', Validators.required],
        depositSim_tax: ['', Validators.required],
        depositSim_monthlyFee: ['', Validators.required]
      });
  }

  ngOnInit(): void {
    this.formDataService.setFormValuesFromSessionStorage('Deposit',this.depositForm);
    this.depositForm.valueChanges.subscribe(() => {
      this.formDataService.setForm(this.depositForm);
    });
    this.depositDataService.currentDepositRows$.subscribe(rows => {
      this.dataSource.data = rows;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }); 
    });
    this.depositDataService.depositTotalSavings$.subscribe(totalSavings => {
      this.depositSim_totalSavings = totalSavings;
    });
    this.depositDataService.depositFinalBalance$.subscribe(finalBalance => {
      this.depositSim_finalBalance = finalBalance;
    });
    this.depositDataService.depositProfitability$ .subscribe(profitability => {
      this.depositSim_profitability = profitability;
    });
    this.depositDataService.depositTotalTaxPaid$.subscribe(totalTaxPaid => {
      this.depositSim_totalTaxPaid = totalTaxPaid;
    });
  }

  public exportToExcel(): void {
    const formData = this.depositForm.value;
    const inputData: any[][] = [
      ['Datele Initiale'],
      ['Suma economisita', formData['depositSim_initialAmount']],
      ['Suma lunara de economisit', formData['depositSim_monthlySaving']],
      ['Maturitate depozit', formData['depositSim_depositMaturity']],
      ['Durata economisirii (luni)', formData['depositSim_savingDuration']],
      ['Dobanda anuala (%)', formData['depositSim_annualInterest']],
      ['Impozit (%)', formData['depositSim_tax']],
      ['Comision administrare lunar', formData['depositSim_monthlyFee']],
    ];
  
    const summaryData = [
      ['Total economisit:', this.depositSim_totalSavings],
      ['Soldul contului la final:', this.depositSim_finalBalance],
      ['Profitabilitate:', this.depositSim_profitability + ' %'],
      ['Total impozit platit:', this.depositSim_totalTaxPaid]
    ];
  
    const tableDisplayHeader= ['Luna', 'Sold Initial', 'Suma Depusa', 'Dobanda', 'Impozit', 'Comision', 'Sold Final'];
    const tableHeader = ['depositSim_luna', 'depositSim_soldInitial', 'depositSim_sumaDepusa', 'depositSim_dobanda', 'depositSim_impozit', 'depositSim_comision', 'depositSim_soldFinal'];

    this.exportService.exportToExcel(this.dataSource.data, inputData, summaryData, tableHeader, tableDisplayHeader, 'Simulare_Depozit');
  }
  
  public exportToPDF(): void {
    const formData = this.depositForm.value;
    const inputData: any[][] = [
      ['Suma economisita', formData['depositSim_initialAmount']],
      ['Suma lunara de economisit', formData['depositSim_monthlySaving']],
      ['Maturitate depozit', formData['depositSim_depositMaturity']],
      ['Durata economisirii (luni)', formData['depositSim_savingDuration']],
      ['Dobanda anuala (%)', formData['depositSim_annualInterest']],
      ['Impozit (%)', formData['depositSim_tax']],
      ['Comision administrare lunar', formData['depositSim_monthlyFee']]
    ];
  
    const summaryData = [
      ['Total economisit:', this.depositSim_totalSavings],
      ['Soldul contului la final:', this.depositSim_finalBalance],
      ['Profitabilitate:', this.depositSim_profitability + ' %'],
      ['Total impozit platit:', this.depositSim_totalTaxPaid]
    ];

    const tableDisplayHeader = ['Luna', 'Sold Initial', 'Suma Depusa', 'Dobanda', 'Impozit', 'Comision', 'Sold Final'];
    const tableHeader = ['depositSim_luna', 'depositSim_soldInitial', 'depositSim_sumaDepusa', 'depositSim_dobanda', 'depositSim_impozit', 'depositSim_comision', 'depositSim_soldFinal'];
  
    this.exportService.exportToPDF(this.dataSource.data, inputData, summaryData, tableHeader, tableDisplayHeader, 'Simulator de Depozit');
  }

  public clearSimulation(): void {
    this.formDataService.clearSimulation(
      this.depositForm,
      this.dataSource,
      'depositSim_'
    );
    this.simulationStateService.updateDepositSimRunning(false);
  }
}
