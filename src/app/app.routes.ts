import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { CreditComponent } from './simulator-components/credit/credit.component';
import { DepositComponent } from './simulator-components/deposit/deposit.component';
import { InvestmentComponent } from './simulator-components/investment/investment.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'credit', component: CreditComponent },
    { path: 'deposit', component: DepositComponent },
    { path: 'investment', component: InvestmentComponent },
   // { path: 'investment/simulator', component: InvestmentComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
export class AppRoutingModule {}
