import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formSubject = new BehaviorSubject<FormGroup | null>(null);

  public setForm(form: FormGroup) {
    this.formSubject.next(form);
  }

  public getForm() {
    return this.formSubject.asObservable();
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

  public setFormValuesFromSessionStorage(formType: string, form: FormGroup): void {
    let sessionValues;
    
    if(formType === 'Credit'){
      sessionValues = this.getCreditSessionValues();
    }

    if(formType === 'Deposit'){
      sessionValues = this.getDepositSessionValues();
    }

    if (sessionValues) {
      form.setValue(sessionValues);
    }
  }

  private getCreditSessionValues(): any {
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

  private getDepositSessionValues(): any {
    return {
      initialAmount: sessionStorage.getItem('initialAmount'),
      monthlySaving: sessionStorage.getItem('monthlySaving'),
      depositMaturity: sessionStorage.getItem('depositMaturity'),
      savingDuration: sessionStorage.getItem('savingDuration'),
      annualInterest: sessionStorage.getItem('annualInterest'),
      tax: sessionStorage.getItem('tax'),
      monthlyFee: sessionStorage.getItem('monthlyFee'),
    };
  }
}
