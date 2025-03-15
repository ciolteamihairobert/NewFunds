import { Component, Input } from '@angular/core';
import { FormDataService } from '../services/form-data.service';
import { FormGroup } from '@angular/forms';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { ToasterService } from '../services/toaster.service';
import { CalculationCenterService } from '../services/calculation-center.service';

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
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.formDataService.getForm().subscribe(form => {
      this.inputForm = form;
    });
  }

  public runSimulation() {
    console.log('aic')
    if(this.inputForm) {
      this.inputForm.markAllAsTouched();
      if (!this.inputForm.valid) {
        this.toasterService.showInfoOnNotCompleted(); 
        return;
      }
      
      for(let value in this.inputForm.value){
        sessionStorage.setItem(value, this.inputForm!.value[value]);
      }
      console.log('aic1')
      if(this.formName === "Credit"){
        this.calculationService.calculateCreditData();
      }
      if(this.formName === "Deposit"){
        console.log('aic3')
        this.calculationService.calculateDepositData();
      }
    } 
    else {
      if(sessionStorage.getItem('loanAmount') !== null && this.formName === "Credit"){
        console.log('aic5')
        this.calculationService.calculateCreditData();
        return;
      }
      if(sessionStorage.getItem('initialAmount') !== null && this.formName === "Deposit"){
        console.log('aic4')
        this.calculationService.calculateDepositData();
        return;
      }

      this.toasterService.showInfoOnNotCompleted(); 
    }
  }
}

