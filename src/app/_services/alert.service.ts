import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable ,  Subject } from 'rxjs';

@Injectable()
export class AlertService {
    public alertSubject = new Subject<any>();

    constructor(private router: Router) { }

    success(message: string) {
        this.alertSubject.next({ type: 'success', text: message });
    }

    error(message: string) {
        this.alertSubject.next({ type: 'error', text: message });
    }

    warning(message: string) {
        this.alertSubject.next({type: 'warning', text: message})
    }

    info(message: string) {
        this.alertSubject.next({type: 'info', text: message})
    }
}
