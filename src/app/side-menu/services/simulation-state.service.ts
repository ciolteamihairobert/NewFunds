import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SimulationStateService {
  private isCreditSimRunningSubject = new BehaviorSubject<boolean>(false);
  private isDepositSimRunningSubject = new BehaviorSubject<boolean>(false);
  private isInvestmentSimRunningSubject = new BehaviorSubject<boolean>(false);
  private areAllSimulatorsCompletedSubject = new BehaviorSubject<boolean>(false);
  private isOptimizationCompletedSubject = new BehaviorSubject<boolean>(false);

  public isCreditSimRunning$ = this.isCreditSimRunningSubject.asObservable();
  public isDepositSimRunning$ = this.isDepositSimRunningSubject.asObservable();
  public isInvestmentSimRunning$ = this.isInvestmentSimRunningSubject.asObservable();
  public areAllSimulatorsCompleted$ = this.areAllSimulatorsCompletedSubject.asObservable();
  public isOptimizationCompleted$ = this.isOptimizationCompletedSubject.asObservable();

  updateCreditSimRunning(isRunning: boolean): void {
    this.isCreditSimRunningSubject.next(isRunning);
  }

  updateDepositSimRunning(isRunning: boolean): void {
    this.isDepositSimRunningSubject.next(isRunning);
  }

  updateInvestmentSimRunning(isRunning: boolean): void {
    this.isInvestmentSimRunningSubject.next(isRunning);
  }

  updateAllSimulatorsCompleted(isCompleted: boolean): void {
    this.areAllSimulatorsCompletedSubject.next(isCompleted);
  }

  updateOptimizationCompleted(isCompleted: boolean): void {
    this.isOptimizationCompletedSubject.next(isCompleted);
  }
}
