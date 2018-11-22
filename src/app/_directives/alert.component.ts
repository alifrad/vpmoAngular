import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar } from '@angular/material';

import { AlertService } from '../_services/index';

@Component({
    // moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html',
    styleUrls: ['alert.component.css']
})

export class AlertComponent implements OnDestroy {
    private subscription: Subscription;

    constructor(
        private alertService: AlertService,
        public snackBar: MatSnackBar
    ) {
        // subscribe to alert messages
        this.subscription = alertService.alertSubject.subscribe(alert => {
            if (alert) {
                this.openSnackBar(alert)
            }
        });
    }

    openSnackBar(alert: any) {
        console.log(alert.type)
        this.snackBar.open(alert.text, alert.type.toUpperCase(), {
            duration: 2000,
            panelClass: alert.type
        });
    }

    ngOnDestroy(): void {
        // unsubscribe on destroy to prevent memory leaks
        this.subscription.unsubscribe();
    }
}
