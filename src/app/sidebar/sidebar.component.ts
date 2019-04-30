import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationStart } from "@angular/router";

import { AuthenticationService } from "../_services/authentication.service";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import 'rxjs/add/operator/filter';


@Component({
  selector: "app-sidebar",
  templateUrl: "sidebar.component.html",
  styleUrls: ["sidebar.component.scss"]
})
export class SidebarComponent implements OnInit, OnDestroy {
  favoriteNodes: any[];
  user: any;
  currentUrl: any = '';

  _unsubscribeAll = new Subject<any>();

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit () {
    this.currentUrl = this.router.url

    this.authService.user
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {
        this.user = user;
      });

    this.authService.favoriteNodes
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(favoriteNodes => {
          this.favoriteNodes = favoriteNodes;
      });

    this.router.events
      .filter(event => event instanceof NavigationStart)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((event:NavigationStart) => {
        this.currentUrl = event.url
      })
  }

  ngOnDestroy () {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  };

};