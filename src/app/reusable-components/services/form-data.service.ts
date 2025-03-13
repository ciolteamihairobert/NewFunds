import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formSubject = new BehaviorSubject<FormGroup | null>(null);

  public setForm(form: FormGroup) {
    this.formSubject.next(form);
  }

  public getForm() {
    return this.formSubject.asObservable();
  }
}
