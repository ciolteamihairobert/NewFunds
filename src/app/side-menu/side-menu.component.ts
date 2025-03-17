
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterModule, CommonModule, MatTooltipModule],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {
  public position: TooltipPosition = 'right';
  public isInvestmentSimulatorCompleted = false;
  public areAllSimulatorsCompleted = false;
  public isOptimizationCompleted = false;
}
