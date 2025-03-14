import { Component, OnInit } from '@angular/core';
import { buttonActions } from './models/title-bar-buttons';

declare global {
  interface Window {
    electronAPI: {
      maximizeWindow: () => void;
      minimizeWindow: () => void;
      closeWindow: () => void;
    };
  }
}

@Component({
  selector: 'app-title-bar',
  standalone: true,
  imports: [],
  templateUrl: './title-bar.component.html',
  styleUrl: './title-bar.component.css'
})
export class TitleBarComponent implements OnInit {
  private buttons = buttonActions;

  constructor() {}

  ngOnInit(): void {

    this.initializeButtonActions();
  }

  private initializeButtonActions(): void {
    this.buttons.forEach(({ id, action }) => {
      const button = document.getElementById(id);
      button?.addEventListener('click', action);
    });
  }

}
