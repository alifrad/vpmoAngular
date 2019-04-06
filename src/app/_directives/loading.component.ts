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
    // Timeout of 10 seconds
    timeout: number = 1000;

    constructor(private _loadingService: LoadingService) {
    }

    ngOnInit() {
	    this._loadingService.onLoadStarted.subscribe(loadingObject => {
            if (loadingObject !== null && typeof(loadingObject) != 'string') {
                // Only timeout reasons have object loadingObjects
                if (this.loadingObjects.indexOf(loadingObject.taskID) >= 0) {
                    var index = this.loadingObjects.indexOf(loadingObject.taskID)
                    this.loadingObjects.splice(index, 1)
                }
            } else if (loadingObject !== null && loadingObject !== 'CLEAR') {
                var index = this.loadingObjects.indexOf(loadingObject)
                if (index < 0) {
                    this.loadingObjects.push(loadingObject)
                    var that = this
                    // Set interval to toggle the loading task OFF after a specified timeout
                    setInterval(function () {
                        that._loadingService.taskTimedout(loadingObject)
                    }, this.timeout)

                } else {
                    this.loadingObjects.splice(index, 1)
                }
            } else if (loadingObject == 'CLEAR') {
                this.loadingObjects = []
            }
	    })
	  }
}
