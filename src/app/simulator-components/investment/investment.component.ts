import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import { HeaderComponent } from '../../reusable-components/header/header.component';
import { FormDataService } from '../../reusable-components/services/form-data.service';
import { InvestmentTableRow } from './models/investmentTable';
import { investmentSim_displayedColumns, investmentSim_savingFrequency } from '../constants';
import { SimulationStateService } from '../../side-menu/services/simulation-state.service';
import { ExportService } from '../../reusable-components/services/export-data.service';

@Component({
  selector: 'app-investment',
  standalone: true,
  imports: [HeaderComponent, CommonModule,
    MatInputModule, MatFormFieldModule,
    MatSelectModule, FormsModule,
    ReactiveFormsModule, ToastrModule,
    MatTableModule, MatPaginatorModule],
  templateUrl: './investment.component.html',
  styleUrl: '../simulatorStyles.css'
})
export class InvestmentComponent {
  public savingFrequency = investmentSim_savingFrequency;
  public displayedColumns = investmentSim_displayedColumns;
  public dataSource = new MatTableDataSource<InvestmentTableRow>([]);
  public investmentForm: FormGroup<any> = new FormGroup<any>({});
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public investmentSim_totalSavings: number = 0;
  public investmentSim_finalBalance: number = 0;
  public investmentSim_profitability: number = 0;
  public investmentSim_totalPartialWithdrawals: number = 0;
  public investmentSim_totalTaxPaid: number = 0;

  private loadDummyData(): void {
    const newDummyData: InvestmentTableRow[] = [
      { investmentSim_luna: 1, investmentSim_soldInitial: 1200, investmentSim_sumaDepusa: 250, investmentSim_profit: 60, investmentSim_impozit: 12, investmentSim_soldFinal: 1500, investmentSim_topUps: 0, investmentSim_withdrawls: 0 },
      { investmentSim_luna: 2, investmentSim_soldInitial: 1500, investmentSim_sumaDepusa: 220, investmentSim_profit: 65, investmentSim_impozit: 13, investmentSim_soldFinal: 1782, investmentSim_topUps: 30, investmentSim_withdrawls: 10 },
      { investmentSim_luna: 3, investmentSim_soldInitial: 1782, investmentSim_sumaDepusa: 350, investmentSim_profit: 80, investmentSim_impozit: 16, investmentSim_soldFinal: 2116, investmentSim_topUps: 90, investmentSim_withdrawls: 20 },
      { investmentSim_luna: 4, investmentSim_soldInitial: 2116, investmentSim_sumaDepusa: 450, investmentSim_profit: 95, investmentSim_impozit: 19, investmentSim_soldFinal: 2642, investmentSim_topUps: 150, investmentSim_withdrawls: 40 },
      { investmentSim_luna: 5, investmentSim_soldInitial: 2642, investmentSim_sumaDepusa: 600, investmentSim_profit: 120, investmentSim_impozit: 24, investmentSim_soldFinal: 3338, investmentSim_topUps: 200, investmentSim_withdrawls: 50 },
      { investmentSim_luna: 6, investmentSim_soldInitial: 3338, investmentSim_sumaDepusa: 700, investmentSim_profit: 140, investmentSim_impozit: 28, investmentSim_soldFinal: 4148, investmentSim_topUps: 250, investmentSim_withdrawls: 60 },
      { investmentSim_luna: 7, investmentSim_soldInitial: 4148, investmentSim_sumaDepusa: 800, investmentSim_profit: 160, investmentSim_impozit: 32, investmentSim_soldFinal: 5300, investmentSim_topUps: 300, investmentSim_withdrawls: 70 },
      { investmentSim_luna: 8, investmentSim_soldInitial: 5300, investmentSim_sumaDepusa: 900, investmentSim_profit: 180, investmentSim_impozit: 36, investmentSim_soldFinal: 6460, investmentSim_topUps: 350, investmentSim_withdrawls: 80 },
      { investmentSim_luna: 9, investmentSim_soldInitial: 6460, investmentSim_sumaDepusa: 1000, investmentSim_profit: 200, investmentSim_impozit: 40, investmentSim_soldFinal: 7660, investmentSim_topUps: 400, investmentSim_withdrawls: 90 },
      { investmentSim_luna: 10, investmentSim_soldInitial: 7660, investmentSim_sumaDepusa: 1100, investmentSim_profit: 220, investmentSim_impozit: 44, investmentSim_soldFinal: 9020, investmentSim_topUps: 450, investmentSim_withdrawls: 100 },
      { investmentSim_luna: 11, investmentSim_soldInitial: 9020, investmentSim_sumaDepusa: 1200, investmentSim_profit: 240, investmentSim_impozit: 48, investmentSim_soldFinal: 10460, investmentSim_topUps: 500, investmentSim_withdrawls: 110 },
      { investmentSim_luna: 12, investmentSim_soldInitial: 10460, investmentSim_sumaDepusa: 1300, investmentSim_profit: 260, investmentSim_impozit: 52, investmentSim_soldFinal: 11868, investmentSim_topUps: 550, investmentSim_withdrawls: 120 }
    ];
    this.dataSource.data = newDummyData;
  }

  constructor(private fb: FormBuilder,
    public formDataService: FormDataService,
    private exportService: ExportService,
    private simulationStateService: SimulationStateService) {
      this.investmentForm = this.fb.group({
        investmentSim_singleDeposit: ['', Validators.required],
        investmentSim_savingFrequency: ['', Validators.required],
        investmentSim_amountToSave: ['', Validators.required],
        investmentSim_savingDuration: ['', Validators.required],
        investmentSim_contractDuration: ['', Validators.required],
        investmentSim_annualIndexation: ['', Validators.required],
        investmentSim_annualEvolution: ['', Validators.required], 
        investmentSim_tax: ['', Validators.required],
      });
  }

  ngOnInit(): void {
    this.formDataService.setFormValuesFromSessionStorage('Investment', this.investmentForm);
    this.investmentForm.valueChanges.subscribe(() => {
      this.formDataService.setForm(this.investmentForm);
    });
    this.loadDummyData();
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }
  
  public updateTotal(row: InvestmentTableRow): void {
    row.investmentSim_soldFinal = row.investmentSim_soldInitial + row.investmentSim_sumaDepusa + row.investmentSim_profit - row.investmentSim_impozit + row.investmentSim_topUps - row.investmentSim_withdrawls;
    this.dataSource.data = [...this.dataSource.data];
  }

  public exportToExcel(): void {
    const formData = this.investmentForm.value;
    const inputData: any[][] = [
      ['Datele Initiale'],
      ['Depunere Unica', formData['investmentSim_singleDeposit']],
      ['Frecventa de economisire', this.savingFrequency[formData['investmentSim_savingFrequency']].viewValue],
      ['Suma de economisit', formData['investmentSim_amountToSave']],
      ['Durata economisirii (Luni)', formData['investmentSim_savingDuration']],
      ['Durata contractului (Luni)', formData['investmentSim_contractDuration']],
      ['Indexare anuala (%)', formData['investmentSim_annualIndexation']],
      ['Evoluție anuala (%)', formData['investmentSim_annualEvolution']],
      ['Impozit (%)', formData['investmentSim_tax']],
    ];
  
    const summaryData = [
      ['Total economisit:', this.investmentSim_totalSavings],
      ['Soldul contului la final:', this.investmentSim_finalBalance],
      ['Profitabilitate:', this.investmentSim_profitability + ' %'],
      ['Total retrageri parțiale:', this.investmentSim_totalPartialWithdrawals + ' %'],
      ['Total impozit platit:', this.investmentSim_totalTaxPaid]
    ];
  
    const tableDisplayHeader = ['Luna', 'Sold Initial', 'Suma Depusa', 'Profit', 'Impozit', 'Sold Final', 'Reincarcari', 'Retrageri'];
    const tableHeader = ['investmentSim_luna', 'investmentSim_soldInitial', 'investmentSim_sumaDepusa', 'investmentSim_profit', 'investmentSim_impozit', 'investmentSim_soldFinal', 'investmentSim_topUps', 'investmentSim_withdrawls'];

    this.exportService.exportToExcel(this.dataSource.data, inputData, summaryData, tableHeader, tableDisplayHeader, 'Simulare_Plan_De_Investitii');
  }
  
  public exportToPDF(): void {
    const formData = this.investmentForm.value;
    const inputData: any[][] = [
      ['Datele Initiale'],
      ['Depunere Unica', formData['investmentSim_singleDeposit']],
      ['Frecventa de economisire', this.savingFrequency[formData['investmentSim_savingFrequency']].viewValue],
      ['Suma de economisit', formData['investmentSim_amountToSave']],
      ['Durata economisirii (Luni)', formData['investmentSim_savingDuration']],
      ['Durata contractului (Luni)', formData['investmentSim_contractDuration']],
      ['Indexare anuala (%)', formData['investmentSim_annualIndexation']],
      ['Evolutie anuala (%)', formData['investmentSim_annualEvolution']],
      ['Impozit (%)', formData['investmentSim_tax']],
    ];
  
    const summaryData = [
      ['Total economisit:', this.investmentSim_totalSavings],
      ['Soldul contului la final:', this.investmentSim_finalBalance],
      ['Profitabilitate:', this.investmentSim_profitability + ' %'],
      ['Total retrageri parțiale:', this.investmentSim_totalPartialWithdrawals + ' %'],
      ['Total impozit platit:', this.investmentSim_totalTaxPaid]
    ];

    const tableDisplayHeader = ['Luna', 'Sold Initial', 'Suma Depusa', 'Profit', 'Impozit', 'Sold Final', 'Reincarcari', 'Retrageri'];
    const tableHeader = ['investmentSim_luna', 'investmentSim_soldInitial', 'investmentSim_sumaDepusa', 'investmentSim_profit', 'investmentSim_impozit', 'investmentSim_soldFinal', 'investmentSim_topUps', 'investmentSim_withdrawls'];
  
    this.exportService.exportToPDF(this.dataSource.data, inputData, summaryData, tableHeader, tableDisplayHeader, 'Simulare Plan de Investitii');
  }

  public clearSimulation(): void {
    this.formDataService.clearSimulation(
      this.investmentForm,
      this.dataSource,
      'investmentSim_'
    );
    this.simulationStateService.updateInvestmentSimRunning(false);
  }
}
