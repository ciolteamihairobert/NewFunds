import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import { HeaderComponent } from '../../reusable-components/header/header.component';
import { FormDataService } from '../../reusable-components/services/form-data.service';
import { ToasterService } from '../../reusable-components/services/toaster.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InvestmentTableRow } from './models/investmentTable';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button';
import { ModalComponent } from './modal/modal.component';
import { MatDialog,MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-investment',
  standalone: true,
  imports: [HeaderComponent, CommonModule,
    MatInputModule, MatFormFieldModule,
    MatSelectModule, FormsModule,
    ReactiveFormsModule, ToastrModule,
    MatTableModule, MatPaginatorModule, 
    MatMenuModule,  
    MatButtonModule,
    ModalComponent, 
    MatButtonModule,
    MatDialogModule
  ],
    
  templateUrl: './investment.component.html',
  styleUrl: '../simulatorStyles.css'
})
export class InvestmentComponent {
  public savingFrequency = [
    { value: '1', viewValue: 'Anual' },
    { value: '2', viewValue: 'Semestrial' },
    { value: '3', viewValue: 'Trimestrial' }, 
    { value: '4', viewValue: 'Lunar' }
  ];
  public displayedColumns = ['luna', 'soldInitial', 'sumaDepusa', 'profit', 'impozit', 'soldFinal', 'topUp', 'retrageri']
  public dataSource = new MatTableDataSource<InvestmentTableRow>([]);
  public investmentForm: FormGroup<any> = new FormGroup<any>({});
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  public totalSavings: number = 0;
  public finalBalance: number = 0;
  public profitability: number = 0;
  public totalPartialWithdrawals: number = 0;
  public totalTaxPaid: number = 0;

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(ModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  constructor(private fb: FormBuilder,
    public formDataService: FormDataService,
    private toasterService: ToasterService) {
      this.investmentForm = this.fb.group({
        singleDeposit: ['', Validators.required],
        savingFrequency: ['', Validators.required],
        amountToSave: ['', Validators.required],
        savingDuration: ['', Validators.required],
        contractDuration: ['', Validators.required],
        annualIndexation: ['', Validators.required],
        annualEvolution: ['', Validators.required], 
        tax: ['', Validators.required]
      });
  }

  ngOnInit(): void {
    this.formDataService.setFormValuesFromSessionStorage('Investment',this.investmentForm);
    this.investmentForm.valueChanges.subscribe(() => {
      this.formDataService.setForm(this.investmentForm);
  });
  }

  /*
  public exportToExcel(): void {
    if (this.dataSource.data.length === 0) {
      this.toasterService.showInfoOnExport();
      return;
    }

    const formData = this.depositForm.value;
    const inputData: any[][] = [];
    inputData.push(['Datele Initiale']);
    inputData.push(['Suma economisită (Ron)', formData['initialAmount']]);
    inputData.push(['Suma lunara de economisit', formData['monthlySaving']]);
    inputData.push(['Maturitate depozit', formData['depositMaturity']]);
    inputData.push(['Durata economisirii', formData['savingDuration']]);
    inputData.push(['Dobanda anuala', formData['annualInterest']]);
    inputData.push(['Impozit', formData['tax']]);
    inputData.push(['Comision administrare lunar', formData['monthlyFee']]);
    inputData.push([]);
  
    const tableHeader = ['Luna', 'Sold Initial', 'Suma depusa', 'Dobanda', 'Impozit', 'Comision', 'Sold Final'];
    const tableData: any[][] = [];
    tableData.push(['Total economisit:', this.totalSavings + ' luni']);
    tableData.push(['Soldul contului la final:', this.finalBalance + ' RON']);
    tableData.push(['Profitabilitate:', this.profitability + ' luni']);
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
      ['Suma economisită (Ron)', formData['initialAmount']],
      ['Suma lunara de economisit', formData['monthlySaving']],
      ['Maturitate depozit', formData['depositMaturity']],
      ['Durata economisirii', formData['savingDuration']],
      ['Dobanda anuala', formData['annualInterest']],
      ['Impozit', formData['tax']],
      ['Comision administrare lunar', formData['monthlyFee']]
    ];

    autoTable(doc, {
      body: inputData,
      startY: 25,
      styles: { halign: 'left', cellPadding: 1},
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    const lastY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 25;

    const summaryData: any[][] = [
      ['Total economisit:', this.totalSavings + ' luni'],
      ['Soldul contului la final:', this.finalBalance + ' RON'],
      ['Profitabilitate:', this.profitability + ' luni'],
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
*/


  public clearSimulation(): void {
    if(this.investmentForm.valid) {
      this.dataSource.data = [];
      sessionStorage.clear();
      this.investmentForm.reset();

      this.toasterService.showSuccessOnClear();
    }

    this.toasterService.showInfoOnClear();
  }
}
