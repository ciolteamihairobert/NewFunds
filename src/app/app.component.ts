import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { MainComponent } from './main/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SideMenuComponent, MainComponent, RouterModule, TitleBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
