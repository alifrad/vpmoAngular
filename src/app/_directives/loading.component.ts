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
    @Input() showOverlay: boolean;

    constructor(private _loadingService: LoadingService) {
    }

    ngOnInit() {
	    this._loadingService.showOverlay.subscribe(value => {
	    	this.showOverlay = value
	    	console.log('Loading', value)
	    })
	  }
}
