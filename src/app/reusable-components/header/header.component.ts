import { Component, Input } from '@angular/core';
import { FormDataService } from '../services/form-data.service';
import { FormGroup } from '@angular/forms';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { ToasterService } from '../services/toaster.service';
import { CalculationCenterService } from '../services/calculation-center.service';
import { SimulationStateService } from '../../side-menu/services/simulation-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() title!: string;
  @Input() formName!: string;
  @Input() exportToExcel!: () => void;
  @Input() exportToPDF!: () => void;
  @Input() clearSimulation!: () => void;
  public position: TooltipPosition = 'below';
  public inputForm: FormGroup | null = null;

  constructor(private formDataService: FormDataService,
    private calculationService: CalculationCenterService,
    private toasterService: ToasterService,
    private simulationStateService: SimulationStateService
  ) {}

  ngOnInit() {
    this.formDataService.getForm().subscribe(form => {
      this.inputForm = form;
    });
  }

  public runSimulation() {
    if(this.inputForm) {
      this.inputForm.markAllAsTouched();
      if (!this.inputForm.valid) {
        this.toasterService.showInfoOnNotCompleted(); 
        return;
      }
      
      for(let value in this.inputForm.value){
        sessionStorage.setItem(value, this.inputForm!.value[value]);
      }
      
      if(this.formName === "Credit"){
        this.simulationStateService.updateCreditSimRunning(true);
        this.calculationService.calculateCreditData();
      }
      if(this.formName === "Deposit"){
        this.simulationStateService.updateDepositSimRunning(true);
        this.calculationService.calculateDepositData();
      }
      if(this.formName === "Investment"){
        this.simulationStateService.updateDepositSimRunning(true);
        this.calculationService.calculateInvestmentData();
      }
    } 
    else {
      if(sessionStorage.getItem('creditSim_loanAmount') !== null && this.formName === "Credit"){
        this.calculationService.calculateCreditData();
        return;
      }
      if(sessionStorage.getItem('depositSim_initialAmount') !== null && this.formName === "Deposit"){
        this.calculationService.calculateDepositData();
        return;
      }
      if(sessionStorage.getItem('investmentSim_singleDeposit') !== null && this.formName === "Investment"){
        this.calculationService.calculateInvestmentData();
        return;
      }

      this.toasterService.showInfoOnNotCompleted(); 
    }
  }
}

