import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../reusable-components/header/header.component";
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormDataService } from '../reusable-components/form-data.service';
import { CreditTableRow } from './creditTable';
import { CreditDataService } from './credit-data.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToasterService } from '../reusable-components/toaster.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-credit',
  standalone: true,
  imports: [HeaderComponent, CommonModule,
    MatInputModule, MatFormFieldModule,
    MatSelectModule, FormsModule,
    ReactiveFormsModule, ToastrModule,
    MatTableModule, MatPaginatorModule
  ],
  templateUrl: './credit.component.html',
  styleUrl: './credit.component.css'
})

export class CreditComponent implements OnInit {
  public repaymentMethods = [
    { value: '1', viewValue: 'Anuități constante' },
    { value: '2', viewValue: 'Rate lunare constante' },
    { value: '3', viewValue: 'Rambursare totală la scadență' }
  ];
  public months: string[] = Array.from({ length: 41 }, (_, i) => (i * 3).toString());
  public displayedColumns = ['luna', 'soldInitial', 'anuitate', 'principal', 'dobanda', 'comisionLunar', 'totalPlata', 'rambursareAnticipata']
  public dataSource = new MatTableDataSource<CreditTableRow>([]);
  public creditForm: FormGroup<any> = new FormGroup<any>({});
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public totalToPay: number = 0;
  public totalPeriod: number = 0;

  constructor(
    private fb: FormBuilder,
    private formDataService: FormDataService,
    private creditDataService: CreditDataService,
    private toasterService: ToasterService) {
      this.creditForm = this.fb.group({
        loanAmount: ['', Validators.required],
        contractingMoment: ['', Validators.required],
        repaymentPeriod: ['', Validators.required],
        repaymentMethod: ['', Validators.required],
        monthlyEarlyRepayment: ['', Validators.required],
        currentInterestRate: ['', Validators.required],
        subsequentInterestRate: ['', Validators.required],
        interestRateReviewPeriod: ['', Validators.required],
        monthlyCommission: ['', Validators.required],
        gracePeriod: ['', Validators.required],
      });
  }

  ngOnInit(): void {
    this.setFormValuesFromSessionStorage();
    this.creditForm.valueChanges.subscribe((values) => {
        this.formDataService.setForm(this.creditForm);
    });
    this.creditDataService.currentCreditRows$.subscribe(rows => {
      this.dataSource.data = rows;
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }); 
    });
    this.creditDataService.creditTotalPeriod$.subscribe(totalPeriod => {
      this.totalPeriod = totalPeriod;
    });
    this.creditDataService.creditTotalCostToPay$.subscribe(totalToPay => {
      this.totalToPay = totalToPay;
    });
  }

  public allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (allowedKeys.includes(event.key)) {
        return;
    }

    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;

    if (/^\d$/.test(event.key)) {
        return;
    }
    if (event.key === '.' && currentValue.length > 0 && !currentValue.includes('.')) {
        return;
    }
    event.preventDefault();
  }

  public exportToExcel(): void {
    if (this.dataSource.data.length === 0) {
      this.toasterService.showInfoOnExport();
      return;
    }

    const formData = this.creditForm.value;
    const inputData: any[][] = [];
    inputData.push(['Datele Initiale']);
    inputData.push(['Suma împrumutată (Ron)', formData['loanAmount']]);
    inputData.push(['Momentul contractării (după ... luni)', formData['contractingMoment']]);
    inputData.push(['Perioada de rambursare (Luni)', formData['repaymentPeriod']]);
    inputData.push(['Modul de rambursare', this.repaymentMethods[formData['repaymentMethod']].viewValue]);
    inputData.push(['Rambursare anticipată lunară (Ron)', formData['monthlyEarlyRepayment']]);
    inputData.push(['Rata dobânzii actuale (%)', formData['currentInterestRate']]);
    inputData.push(['Rata dobânzii ulterioare (%)', formData['subsequentInterestRate']]);
    inputData.push(['Revizuirea ratei dobânzii (Luni)', formData['interestRateReviewPeriod']]);
    inputData.push(['Comision lunar (%)', formData['monthlyCommission']]);
    inputData.push(['Perioada de grație (Luni)', formData['gracePeriod']]);
    inputData.push([]);
  
    const tableHeader = ['Luna', 'Sold Initial', 'Anuitate', 'Principal', 'Dobanda', 'Comision Lunar', 'Total Plata', 'Rambursare Anticipata'];
    const tableData: any[][] = [];
    tableData.push(['Creditul se poate închide în:', this.totalPeriod + ' luni']);
    tableData.push(['Totalul de rambursat este:', this.totalToPay + ' RON']);
    tableData.push([]);
    tableData.push(tableHeader);
    this.dataSource.data.forEach(row => {
      tableData.push([
        row.luna,
        row.soldInitial,
        row.anuitate,
        row.principal,
        row.dobanda,
        row.comisionLunar,
        row.totalPlata,
        row.rambursareAnticipata
      ]);
    });
    const finalData = inputData.concat(tableData);
  
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(finalData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
    ws['!cols'] = [
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 35 },
      { wch: 30 },
      { wch: 30 }
    ];
  
    for (const cell in ws) {
      if (ws.hasOwnProperty(cell) && cell[0] !== '!') {
        ws[cell].s = ws[cell].s || {};
        ws[cell].s.alignment = { horizontal: 'center', vertical: 'center' };
      }
    }
  
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/T/, '_').replace(/\..+/, '');
  
    XLSX.utils.book_append_sheet(wb, ws, 'SimulatorDeCredit');
    XLSX.writeFile(wb, 'SimulatorDeCredit' + formattedDate + '.xlsx');
  }

  public exportToPDF(): void {
    if (this.dataSource.data.length === 0) {
      this.toasterService.showInfoOnExport();
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Simulator de Credit', 105, 15, { align: 'center' });

    const formData = this.creditForm.value;
    const inputData: any[][] = [
      ['Suma împrumutata (Ron)', formData['loanAmount']],
      ['Momentul contractarii (dupa ... luni)', formData['contractingMoment']],
      ['Perioada de rambursare (Luni)', formData['repaymentPeriod']],
      ['Modul de rambursare', this.replaceRomanianCharacters(this.repaymentMethods[formData['repaymentMethod']].viewValue)],
      ['Rambursare anticipata lunara (Ron)', formData['monthlyEarlyRepayment']],
      ['Rata dobanzii actuale (%)', formData['currentInterestRate']],
      ['Rata dobanzii ulterioare (%)', formData['subsequentInterestRate']],
      ['Revizuirea ratei dobanzii (Luni)', formData['interestRateReviewPeriod']],
      ['Comision lunar (%)', formData['monthlyCommission']],
      ['Perioada de gratie (Luni)', formData['gracePeriod']]
    ];
    console.log(this.repaymentMethods[formData['repaymentMethod']].viewValue)

    autoTable(doc, {
      body: inputData,
      startY: 25,
      styles: { halign: 'left', cellPadding: 1},
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    const lastY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 25;

    const summaryData: any[][] = [
      ['Creditul se poate inchide in:', this.totalPeriod + ' luni'],
      ['Totalul de rambursat este:', this.totalToPay + ' RON']
    ];

    autoTable(doc, {
      body: summaryData,
      startY: lastY + 10,
      styles: { halign: 'center', fontSize: 10, cellPadding: 3 }
    });

    const tableHeader = ['Luna', 'Sold Initial', 'Anuitate', 'Principal', 'Dobanda', 'Comision Lunar', 'Total Plata', 'Rambursare Anticipata'];
    const tableData: any[][] = this.dataSource.data.map(row => [
      row.luna,
      row.soldInitial,
      row.anuitate,
      row.principal,
      row.dobanda,
      row.comisionLunar,
      row.totalPlata,
      row.rambursareAnticipata
    ]);

    const newStartY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : lastY + 10;

    autoTable(doc, {
      head: [tableHeader],
      body: tableData,
      startY: newStartY + 10,
      styles: { fontSize: 11, cellPadding: 2 },
      headStyles: { fillColor: [52, 152, 219], textColor: 255, fontSize: 10 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center' },
        5: { halign: 'center' },
        6: { halign: 'center' },
        7: { halign: 'center' }
      }
    });

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');

    doc.save(`SimulatorDeCredit_${formattedDate}.pdf`);
  }

  public clearSimulation(): void {
    if(this.creditForm.valid) {
      this.dataSource.data = [];
      sessionStorage.clear();
      this.creditForm.reset();

      this.toasterService.showSuccessOnClear();
    }

    this.toasterService.showInfoOnClear();
  }
  
  private replaceRomanianCharacters(text: string): string {
    const charMap: { [key: string]: string } = {
      'ș': 's',
      'ț': 't',
      'ă': 'a',
      'î': 'i',
      'â': 'a',
      'Ș': 'S',
      'Ț': 'T',
      'Ă': 'A',
      'Î': 'I',
      'Â': 'A'
    };
  
    return text.replace(/[șțăîâȘȚĂÎÂ]/g, match => charMap[match]);
  }

  private setFormValuesFromSessionStorage(): void {
    const sessionValues = this.getSessionValues();
  
    if (sessionValues) {
      this.creditForm.setValue(sessionValues);
    }
  }
  
  private getSessionValues(): any {
    return {
      loanAmount: sessionStorage.getItem('loanAmount'),
      contractingMoment: sessionStorage.getItem('contractingMoment'),
      repaymentPeriod: sessionStorage.getItem('repaymentPeriod'),
      repaymentMethod: sessionStorage.getItem('repaymentMethod'),
      monthlyEarlyRepayment: sessionStorage.getItem('monthlyEarlyRepayment'),
      currentInterestRate: sessionStorage.getItem('currentInterestRate'),
      subsequentInterestRate: sessionStorage.getItem('subsequentInterestRate'),
      interestRateReviewPeriod: sessionStorage.getItem('interestRateReviewPeriod'),
      monthlyCommission: sessionStorage.getItem('monthlyCommission'),
      gracePeriod: sessionStorage.getItem('gracePeriod')
    };
  }
}
