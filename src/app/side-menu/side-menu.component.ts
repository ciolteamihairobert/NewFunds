
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { SimulationStateService } from './services/simulation-state.service';


@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterModule, CommonModule, MatTooltipModule],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {
  public position: TooltipPosition = 'right';
  public areAllSimulatorsCompleted = false;
  public isOptimizationCompleted = false;
  public isCreditSimRunning = false;
  public isDepositSimRunning = false;
  public isInvestmentSimRunning = false;

  constructor(private simulationStateService: SimulationStateService) {}

  ngOnInit(): void {
    this.simulationStateService.isCreditSimRunning$.subscribe(isRunning => {
      this.isCreditSimRunning = isRunning;
    });

    this.simulationStateService.isDepositSimRunning$.subscribe(isRunning => {
      this.isDepositSimRunning = isRunning;
    });

    this.simulationStateService.isInvestmentSimRunning$.subscribe(isRunning => {
      this.isInvestmentSimRunning = isRunning;
    });

    this.simulationStateService.areAllSimulatorsCompleted$.subscribe(isCompleted => {
      this.areAllSimulatorsCompleted = isCompleted;
    });

    this.simulationStateService.isOptimizationCompleted$.subscribe(isCompleted => {
      this.isOptimizationCompleted = isCompleted;
    });
  }
}
