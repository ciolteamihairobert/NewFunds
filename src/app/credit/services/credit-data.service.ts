import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CreditTableRow } from '../models/creditTable';

@Injectable({
  providedIn: 'root'
})
export class CreditDataService {
  private creditRowsSource = new BehaviorSubject<CreditTableRow[]>([]);
  private creditTotalCostToPay = new BehaviorSubject<number>(0);
  private creditTotalPeriod = new BehaviorSubject<number>(0);

  currentCreditRows$ = this.creditRowsSource.asObservable();
  creditTotalCostToPay$ = this.creditTotalCostToPay.asObservable();
  creditTotalPeriod$ = this.creditTotalPeriod.asObservable();
  
  public updateCreditRows(rows: CreditTableRow[]) {
    this.creditRowsSource.next(rows);
  }

  public updateCreditTotalCostToPay(totalCostToPay: number) {
    this.creditTotalCostToPay.next(totalCostToPay);
  }

  public updateCreditTotalPeriod(totalPeriod: number) {
    this.creditTotalPeriod.next(totalPeriod);
  }
}
