import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class Paginator extends MatPaginatorIntl {
  
  constructor() {
    super();
    this.itemsPerPageLabel = 'Elemente pe pagină';
    this.nextPageLabel = 'Pagina următoare';
    this.previousPageLabel = 'Pagina anterioară';
    this.firstPageLabel = 'Prima pagină';
    this.lastPageLabel = 'Ultima pagină';

    this.getRangeLabel = (page: number, pageSize: number, length: number): string => {
        if (length === 0 || pageSize === 0) {
          return `0 din ${length}`;
        }
        length = Math.max(length, 0);
        const start = page * pageSize + 1;
        const end = Math.min(start + pageSize - 1, length);
        return `${start} - ${end} din ${length}`;
    }
  }
}
