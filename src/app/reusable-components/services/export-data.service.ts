import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Injectable } from '@angular/core';
import { ToasterService } from '../../reusable-components/services/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(private toasterService: ToasterService) {}

  public exportToExcel(dataSource: any[], inputData: any[][], summaryData: any[][],tableHeader: string[], tableDisplayHeader: string[], filename: string): void {
    if (dataSource.length === 0) {
      this.toasterService.showInfoOnExport();
      return;
    }

    const tableData: any[][] = [];
    tableData.push(...summaryData);
    tableData.push([]);
    tableData.push(tableDisplayHeader);

    dataSource.forEach(row => {
      const rowData = tableHeader.map(header => row[header]);
      tableData.push(rowData);
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

    XLSX.utils.book_append_sheet(wb, ws, filename);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/T/, '_').replace(/\..+/, '');
    XLSX.writeFile(wb, `${filename}_${formattedDate}.xlsx`);
  }

  public exportToPDF(dataSource: any[], inputData: any[][], summaryData: any[][], tableHeader: string[], tableDisplayHeader: string[], title: string): void {
    if (dataSource.length === 0) {
      this.toasterService.showInfoOnExport();
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(title, 105, 15, { align: 'center' });

    autoTable(doc, {
      body: inputData,
      startY: 25,
      styles: { halign: 'left', cellPadding: 1 },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    const lastY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : 25;

    autoTable(doc, {
      body: summaryData,
      startY: lastY + 10,
      styles: { halign: 'center', fontSize: 10, cellPadding: 3 }
    });

    const tableData = dataSource.map(row => tableHeader.map(header => row[header]));
    const newStartY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY : lastY + 10;

    autoTable(doc, {
      head: [tableDisplayHeader],
      body: tableData,
      startY: newStartY + 10,
      styles: { fontSize: 11, cellPadding: 2 },
      headStyles: { fillColor: [52, 152, 219], textColor: 255, fontSize: 10 },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/T/, '_').replace(/\..+/, '');
    doc.save(`${title.replace(' ', '_')}_${formattedDate}.pdf`);
  }
}
