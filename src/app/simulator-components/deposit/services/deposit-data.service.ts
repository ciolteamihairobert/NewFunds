import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DepositTableRow } from '../models/depositTable';

@Injectable({
  providedIn: 'root'
})
export class DepositDataService {
  private depositRowsSource = new BehaviorSubject<DepositTableRow[]>([]);
  private depositTotalSavings = new BehaviorSubject<number>(0);
  private depositFinalBalance = new BehaviorSubject<number>(0);
  private depositProfitability = new BehaviorSubject<number>(0);
  private depositTotalTaxPaid = new BehaviorSubject<number>(0);


  currentDepositRows$ = this.depositRowsSource.asObservable();
  depositTotalSavings$ = this.depositTotalSavings.asObservable();
  depositFinalBalance$ = this.depositFinalBalance.asObservable();
  depositProfitability$ = this.depositProfitability.asObservable();
  depositTotalTaxPaid$ = this.depositTotalTaxPaid.asObservable();
  
  public updateDepositRows(rows: DepositTableRow[]) {
    this.depositRowsSource.next(rows);
  }

  public updateDepositTotalSavings(totalSavings: number) {
    this.depositTotalSavings.next(totalSavings);
  }

  public updateDepositFinalBalance(finalBalance: number) {
    this.depositFinalBalance.next(finalBalance);
  }

  public updateDepositProfitability(profitability: number) {
    this.depositProfitability.next(profitability);
  }

  public updateDepositTotalTaxPaid(totalTaxPaid: number) {
    this.depositTotalTaxPaid.next(totalTaxPaid);
  }
}
