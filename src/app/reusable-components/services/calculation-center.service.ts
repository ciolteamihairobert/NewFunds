import { Injectable } from '@angular/core';
import { CreditTableRow } from '../../simulator-components/credit/models/creditTable';
import { CreditDataService } from '../../simulator-components/credit/services/credit-data.service';
import { DepositDataService } from '../../simulator-components/deposit/services/deposit-data.service';
import { DepositTableRow } from '../../simulator-components/deposit/models/depositTable';

@Injectable({
  providedIn: 'root'
})
export class CalculationCenterService {

  constructor(private creditDataService: CreditDataService,
    private depositDataService: DepositDataService,
    //private investmentDataService: InvestmentDataService
  ) {}

  public calculateCreditData() {
    const loanAmount = parseFloat(sessionStorage.getItem('loanAmount')!);
    const contractingMoment = parseInt(sessionStorage.getItem('contractingMoment')!);
    let repaymentPeriod = parseInt(sessionStorage.getItem('repaymentPeriod')!);
    const repaymentMethod = sessionStorage.getItem('repaymentMethod')!;
    const monthlyEarlyRepayment = parseFloat(sessionStorage.getItem('monthlyEarlyRepayment')!);
    const currentInterestRate = parseFloat(sessionStorage.getItem('currentInterestRate')!);

    const subsequentInterestRate = parseFloat(sessionStorage.getItem('subsequentInterestRate')!);
    const interestRateReviewPeriod = parseInt(sessionStorage.getItem('interestRateReviewPeriod')!);
    const monthlyCommission = parseFloat(sessionStorage.getItem('monthlyCommission')!);
    const gracePeriod = parseInt(sessionStorage.getItem('gracePeriod')!);
  
    if (loanAmount <= 0 || repaymentPeriod <= 0) {
      this.creditDataService.updateCreditRows([]);
      return;
    }
  
    if (contractingMoment > 0) {
      repaymentPeriod += contractingMoment;
    }
  
    let rows: CreditTableRow[] = [];
    let soldInitial = loanAmount;
    let anuitate = 0;
    let principal = 0;
    let dobanda = 0;
    let comisionLunar = 0;
    let totalPlata = 0;
    let rambursareAnticipata = 0;
    let totalPeriod = 0;
    let totalCostToPay = 0;
    for (let month = 1; month <= repaymentPeriod; month++) {
      let row: CreditTableRow;

      if (month < contractingMoment + 1) {
        row = {
          luna: month,
          soldInitial: 0,
          anuitate: 0,
          principal: 0,
          dobanda: 0,
          comisionLunar: 0,
          totalPlata: 0,
          rambursareAnticipata: 0
        };
        rows.push(row);
        continue;
      } else {
        totalPeriod++;
      }
      
      soldInitial = soldInitial - principal - rambursareAnticipata;
      comisionLunar = monthlyCommission/100 * soldInitial;

      const isCurrentRatePeriod = (month <= (interestRateReviewPeriod + contractingMoment)) || interestRateReviewPeriod === 0;
      const applicableRate = isCurrentRatePeriod ?
        currentInterestRate :
        subsequentInterestRate;
      const monthlyRate = applicableRate / 1200;
      dobanda = soldInitial * monthlyRate;
  
      if (month <= gracePeriod + contractingMoment) {
        anuitate = dobanda;
        principal = 0;
      } else {
        if (repaymentMethod === "1") {
          if (month === gracePeriod + contractingMoment + 1 ||
              (month === interestRateReviewPeriod + contractingMoment + 1 && interestRateReviewPeriod > 0)) {
            const remainingTerm = repaymentPeriod - month + 1;
            const denominator = 1 - Math.pow(1 + monthlyRate, -remainingTerm);
            anuitate = denominator !== 0 ?
              soldInitial * monthlyRate / denominator :
              0;
          }
          principal = anuitate - dobanda;
        }
        else if (repaymentMethod === "2") {
          principal = loanAmount / (repaymentPeriod - gracePeriod);
          anuitate = dobanda + principal;
        }
        else if (repaymentMethod === "3") {
          if (month === repaymentPeriod) {
            principal = soldInitial;
            anuitate = dobanda + principal;
          } else {
            principal = 0;
            anuitate = dobanda;
          }
        }
        else {
          anuitate = dobanda;
          principal = 0;
        }
      }
  
      totalPlata = anuitate + comisionLunar;
  
      if (monthlyEarlyRepayment === 0 || soldInitial <= 0) {
        rambursareAnticipata = 0;
      } else {
        rambursareAnticipata = (soldInitial - principal) < anuitate ?
          (soldInitial - principal) : 
          monthlyEarlyRepayment;
      }

      row = {
        luna: month,
        soldInitial: parseFloat(soldInitial.toFixed(2)),
        anuitate: parseFloat(anuitate.toFixed(2)),
        principal: parseFloat(principal.toFixed(2)),
        dobanda: parseFloat(dobanda.toFixed(2)),
        comisionLunar: parseFloat(comisionLunar.toFixed(2)),
        totalPlata: parseFloat(totalPlata.toFixed(2)),
        rambursareAnticipata: parseFloat(rambursareAnticipata.toFixed(2))
      };
      
      if (soldInitial === 0) {
        totalPeriod--;
        break;
      }
      totalCostToPay += rambursareAnticipata + totalPlata;
      rows.push(row);
    }

    this.creditDataService.updateCreditTotalPeriod(totalPeriod);
    this.creditDataService.updateCreditTotalCostToPay(Number(totalCostToPay.toFixed(2)));
    this.creditDataService.updateCreditRows(rows);
  } 

  public calculateDepositData() {
    const initialAmount = parseFloat(sessionStorage.getItem('initialAmount')!);
    const monthlySaving = parseFloat(sessionStorage.getItem('monthlySaving')!);
    const depositMaturity = parseInt(sessionStorage.getItem('depositMaturity')!);
    const savingDuration = parseInt(sessionStorage.getItem('savingDuration')!);
    const annualInterest = parseFloat(sessionStorage.getItem('annualInterest')!);
    const tax = parseFloat(sessionStorage.getItem('tax')!);
    const monthlyFee = parseFloat(sessionStorage.getItem('monthlyFee')!);
  
    let rows: DepositTableRow[] = [];
    let soldInitial = 0;
    let dobanda = 0;
    let impozit = 0;
    let comision = 0;
    let soldFinal = 0;
    let totalImpozit = 0;
    for (let month = 1; month <= savingDuration; month++) {
      let row: DepositTableRow;

      if(month != 1){
        soldInitial = soldFinal;
      }
      else{
        soldInitial = initialAmount; 
      }

      dobanda = (soldInitial + monthlySaving) * (Math.pow(1 + annualInterest/100, 1 / 12) - 1);
      impozit = (tax /100) * dobanda;
      totalImpozit += impozit;
      comision = (initialAmount === 0 && monthlySaving === 0) ? 0 : monthlyFee;
      soldFinal = soldInitial + monthlySaving + dobanda - impozit - comision;
      row = {
        luna: month,
        soldInitial: parseFloat(soldInitial.toFixed(2)),
        sumaDepusa: parseFloat(monthlySaving.toFixed(2)),
        dobanda: parseFloat(dobanda.toFixed(2)),
        impozit: parseFloat(impozit.toFixed(2)),
        comision: parseFloat(comision.toFixed(2)),
        soldFinal: parseFloat(soldFinal.toFixed(2))
      }
      rows.push(row);
    }
    const totalSavings = monthlySaving * savingDuration + initialAmount;
    const profitability = parseFloat((((soldFinal - totalSavings) / totalSavings)*100).toFixed(2))
    this.depositDataService.updateDepositTotalSavings(parseFloat(totalSavings.toFixed(2)));
    this.depositDataService.updateDepositProfitability(profitability);
    this.depositDataService.updateDepositRows(rows);
    this.depositDataService.updateDepositFinalBalance(parseFloat(soldFinal.toFixed(2)));
    this.depositDataService.updateDepositTotalTaxPaid(parseFloat(totalImpozit.toFixed(2)));
  }
}
