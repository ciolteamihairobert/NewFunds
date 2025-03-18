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
import { ToasterService } from '../../reusable-components/services/toaster.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DepositDataService } from './services/deposit-data.service';

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
  public displayedColumns = ['luna', 'soldInitial', 'sumaDepusa', 'dobanda', 'impozit', 'comision', 'soldFinal']
  public dataSource = new MatTableDataSource<DepositTableRow>([]);
  public depositForm: FormGroup<any> = new FormGroup<any>({});
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public totalSavings: number = 0;
  public finalBalance: number = 0;
  public profitability: number = 0;
  public totalTaxPaid: number = 0;

  constructor(private fb: FormBuilder,
    public formDataService: FormDataService,
    private depositDataService: DepositDataService,
    private toasterService: ToasterService) {
      this.depositForm = this.fb.group({
        initialAmount: ['', Validators.required],
        monthlySaving: ['', Validators.required],
        depositMaturity: ['', Validators.required],
        savingDuration: ['', Validators.required],
        annualInterest: ['', Validators.required],
        tax: ['', Validators.required],
        monthlyFee: ['', Validators.required]
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
      this.totalSavings = totalSavings;
    });
    this.depositDataService.depositFinalBalance$.subscribe(finalBalance => {
      this.finalBalance = finalBalance;
    });
    this.depositDataService.depositProfitability$ .subscribe(profitability => {
      this.profitability = profitability;
    });
    this.depositDataService.depositTotalTaxPaid$.subscribe(totalTaxPaid => {
      this.totalTaxPaid = totalTaxPaid;
    });

  }

  public exportToExcel(): void {
    if (this.dataSource.data.length === 0) {
      this.toasterService.showInfoOnExport();
      return;
    }

    const formData = this.depositForm.value;
    const inputData: any[][] = [];
    inputData.push(['Datele Initiale']);
    inputData.push(['Suma economisita (Ron)', formData['initialAmount']]);
    inputData.push(['Suma lunara de economisit (Ron)', formData['monthlySaving']]);
    inputData.push(['Maturitate depozit', formData['depositMaturity']]);
    inputData.push(['Durata economisirii (luni)', formData['savingDuration']]);
    inputData.push(['Dobanda anuala (%)', formData['annualInterest']]);
    inputData.push(['Impozit (%)', formData['tax']]);
    inputData.push(['Comision administrare lunar (Ron)', formData['monthlyFee']]);
    inputData.push([]);
  
    const tableHeader = ['Luna', 'Sold Initial', 'Suma depusa', 'Dobanda', 'Impozit', 'Comision', 'Sold Final'];
    const tableData: any[][] = [];
    tableData.push(['Total economisit:', this.totalSavings + ' RON']);
    tableData.push(['Soldul contului la final:', this.finalBalance + ' RON']);
    tableData.push(['Profitabilitate:', this.profitability + ' %']);
    tableData.push(['Total impozit platit:', this.totalTaxPaid + ' RON']);
    tableData.push([]);
    tableData.push(tableHeader);
    this.dataSource.data.forEach(row => {
      tableData.push([
        row.luna,
        row.soldInitial,
        row.sumaDepusa,
        row.dobanda,
        row.impozit,
        row.comision,
        row.soldFinal,
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
  
    XLSX.utils.book_append_sheet(wb, ws, 'SimulatorDepozit');
    XLSX.writeFile(wb, 'SimulatorDepozit' + formattedDate + '.xlsx');
  }

  public exportToPDF(): void {
    if (this.dataSource.data.length === 0) {
      this.toasterService.showInfoOnExport();
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text('Simulator Depozit', 105, 15, { align: 'center' });

    const formData = this.depositForm.value;
    const inputData: any[][] = [
      ['Suma economisita (Ron)', formData['initialAmount']],
      ['Suma lunara de economisit (Ron)', formData['monthlySaving']],
      ['Maturitate depozit', formData['depositMaturity']],
      ['Durata economisirii (luni)', formData['savingDuration']],
      ['Dobanda anuala (%)', formData['annualInterest']],
      ['Impozit (%)', formData['tax']],
      ['Comision administrare lunar (Ron)', formData['monthlyFee']]
    ];

    autoTable(doc, {
      body: inputData,
      startY: 25,
      styles: { halign: 'left', cellPadding: 1},
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    const lastY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 25;

    const summaryData: any[][] = [
      ['Total economisit:', this.totalSavings + ' RON'],
      ['Soldul contului la final:', this.finalBalance + ' RON'],
      ['Profitabilitate:', this.profitability + ' %'],
      ['Total impozit platit:', this.totalTaxPaid + ' RON']
    ];

    autoTable(doc, {
      body: summaryData,
      startY: lastY + 10,
      styles: { halign: 'center', fontSize: 10, cellPadding: 3 }
    });

    const tableHeader = ['Luna', 'Sold Initial', 'Suma depusa', 'Dobanda', 'Impozit', 'Comision', 'Sold Final'];
    const tableData: any[][] = this.dataSource.data.map(row => [
      row.luna,
      row.soldInitial,
      row.sumaDepusa,
      row.dobanda,
      row.impozit,
      row.comision,
      row.soldFinal
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

    doc.save(`SimulatorDepozit_${formattedDate}.pdf`);
  }

  public clearSimulation(): void {
    if(this.depositForm.valid) {
      this.dataSource.data = [];
      sessionStorage.clear();
      this.depositForm.reset();

      this.toasterService.showSuccessOnClear();
    }
    else 
    {
      this.toasterService.showInfoOnClear();
    }
  }
}
