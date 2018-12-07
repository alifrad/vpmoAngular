import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { LoadingService } from '../_services/loading.service';

@Component({
    // moduleId: module.id,
    selector: 'loading',
    templateUrl: 'loading.component.html',
    styleUrls: ['loading.component.css',]
})

export class LoadingComponent {
    message: string = 'Loading!';
    loadingObjects: string[] = [];

    constructor(private _loadingService: LoadingService) {
    }

    ngOnInit() {
	    this._loadingService.onLoadStarted.subscribe(loadingObject => {
            console.log('LOADING', this.loadingObjects)
            if (loadingObject !== null && loadingObject !== 'CLEAR') {
                var index = this.loadingObjects.indexOf(loadingObject)
                if (index < 0) {
                    this.loadingObjects.push(loadingObject)
                } else {
                    this.loadingObjects.splice(index, 1)
                }
            } else if (loadingObject == 'CLEAR') {
                this.loadingObjects = []
            }
	    })
	  }
}
