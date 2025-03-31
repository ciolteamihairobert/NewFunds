import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formSubject = new BehaviorSubject<FormGroup | null>(null);

  constructor(private toasterService: ToasterService) {}

  public clearSimulation(form: any, dataSource: any, sessionKeyPrefix: string): void {
    console.log(form.valid);
    if (form.valid) {
      dataSource.data = [];
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith(sessionKeyPrefix)) {
          sessionStorage.removeItem(key);
        }
      });
      form.reset();
      this.toasterService.showSuccessOnClear();
    } 
    else 
    {
      this.toasterService.showInfoOnClear();
    }
  }

  public setForm(form: FormGroup) {
    this.formSubject.next(form);
  }

  public getForm() {
    return this.formSubject.asObservable();
  }

  public allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (allowedKeys.includes(event.key)){
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;

    if (/^\d$/.test(event.key)){
      return;
    }
    if (event.key === '.' && currentValue.length > 0 && !currentValue.includes('.')){
      return;
    }
    event.preventDefault();
  }

  public setFormValuesFromSessionStorage(formType: string, form: FormGroup): void {
    let sessionValues;
    
    if(formType === 'Credit'){
      sessionValues = this.getCreditSessionValues();
    }

    if(formType === 'Deposit'){
      sessionValues = this.getDepositSessionValues();
    }

    if(formType === 'Investment'){
      sessionValues = this.getInvestmentSessionValues();
    }

    if (sessionValues) {
      form.setValue(sessionValues);
    }
  }

  private getCreditSessionValues(): any {
    return {
      creditSim_loanAmount: sessionStorage.getItem('creditSim_loanAmount'),
      creditSim_contractingMoment: sessionStorage.getItem('creditSim_contractingMoment'),
      creditSim_repaymentPeriod: sessionStorage.getItem('creditSim_repaymentPeriod'),
      creditSim_repaymentMethod: sessionStorage.getItem('creditSim_repaymentMethod'),
      creditSim_monthlyEarlyRepayment: sessionStorage.getItem('creditSim_monthlyEarlyRepayment'),
      creditSim_currentInterestRate: sessionStorage.getItem('creditSim_currentInterestRate'),
      creditSim_subsequentInterestRate: sessionStorage.getItem('creditSim_subsequentInterestRate'),
      creditSim_interestRateReviewPeriod: sessionStorage.getItem('creditSim_interestRateReviewPeriod'),
      creditSim_monthlyCommission: sessionStorage.getItem('creditSim_monthlyCommission'),
      creditSim_gracePeriod: sessionStorage.getItem('creditSim_gracePeriod')
    };
  }

  private getDepositSessionValues(): any {
    return {
      depositSim_initialAmount: sessionStorage.getItem('depositSim_initialAmount'),
      depositSim_monthlySaving: sessionStorage.getItem('depositSim_monthlySaving'),
      depositSim_depositMaturity: sessionStorage.getItem('depositSim_depositMaturity'),
      depositSim_savingDuration: sessionStorage.getItem('depositSim_savingDuration'),
      depositSim_annualInterest: sessionStorage.getItem('depositSim_annualInterest'),
      depositSim_tax: sessionStorage.getItem('depositSim_tax'),
      depositSim_monthlyFee: sessionStorage.getItem('depositSim_monthlyFee')
    };
  }

  private getInvestmentSessionValues(): any {
    return {
      investmentSim_singleDeposit: sessionStorage.getItem('investmentSim_singleDeposit'),
      investmentSim_savingFrequency: sessionStorage.getItem('investmentSim_savingFrequency'),
      investmentSim_amountToSave: sessionStorage.getItem('investmentSim_amountToSave'),
      investmentSim_savingDuration: sessionStorage.getItem('investmentSim_savingDuration'),
      investmentSim_contractDuration: sessionStorage.getItem('investmentSim_contractDuration'),
      investmentSim_annualIndexation: sessionStorage.getItem('investmentSim_annualIndexation'),
      investmentSim_annualEvolution: sessionStorage.getItem('investmentSim_annualEvolution'),
      investmentSim_tax: sessionStorage.getItem('investmentSim_tax')
    };
  }
}
