import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
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
  public isDropdownOpen: boolean = false; 
  public selectedLanguage: string = 'EN';

  constructor(private elementRef: ElementRef,
    //private languageService: LanguageChangerService
  ) {}

  ngOnInit(): void {
    //.languageService.setLanguage(this.selectedLanguage);
    this.initializeButtonActions();
  }

  public toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  public selectLanguage(language: string): void {
    //this.languageService.updateLanguage(language);
    this.selectedLanguage = language;
    this.isDropdownOpen = false;
  }

  private initializeButtonActions(): void {
    this.buttons.forEach(({ id, action }) => {
      const button = document.getElementById(id);
      button?.addEventListener('click', action);
    });
  }

  @HostListener('document:click', ['$event'])
  public handleOutsideClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }
}
