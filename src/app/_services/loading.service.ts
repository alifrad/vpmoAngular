import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/index';

@Injectable()
export class LoadingService {
  public showOverlay = new BehaviorSubject(false);

  public hide() {
    this.showOverlay.next(false)
  }

  public show() {
    this.showOverlay.next(true)
  }
}