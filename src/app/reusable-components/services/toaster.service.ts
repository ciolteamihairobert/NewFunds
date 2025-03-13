import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toastr: ToastrService) {}
  
  public showSuccessOnExport() : void {
    this.toastr.success('Export realizat cu succes!', 'Succes 🎉', {
      timeOut: 300000
    });
  }

  public showInfoOnExport() : void {
    this.toastr.info('Ups! Nu avem date de exportat momentan 😊', '', {
      timeOut: 30000
    });
  }

  public showSuccessOnClear(): void {
    this.toastr.success('Simularea a fost ștearsă cu succes! 🧹', '', {
      timeOut: 300000
    });
  }

  public showInfoOnClear(): void {
    this.toastr.info('Nu există nicio simulare de șters! 😊', '', {
      timeOut: 30000
    });
  }

  public showInfoOnNotCompleted() : void {
    this.toastr.info('Mai sunt câteva date de introdus 😊', '', {
      timeOut: 300000
      
    });
  }
}
