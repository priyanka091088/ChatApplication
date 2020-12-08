import { Component, EventEmitter, Injector, OnInit, Output, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { SignalRAspNetCoreHelper } from '@shared/helpers/SignalRAspNetCoreHelper';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import * as $ from 'jquery';

@Component({
  templateUrl: './app.component.html'
})
export class AppComponent extends AppComponentBase implements OnInit {
  sidebarExpanded: boolean;

  timeLeft: number = 10;
  interval;
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    private renderer: Renderer2,
    private _layoutStore: LayoutStoreService,private router:Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'sidebar-mini');
    
    SignalRAspNetCoreHelper.initSignalR();

      abp.event.on('abp.notifications.received', (userNotification) => {
      abp.notifications.showUiNotifyForUserNotification(userNotification);

      // Desktop notification
      Push.create('AbpZeroTemplate', {
        body: userNotification.notification.data.message,
        icon: abp.appPath + 'assets/app-logo-small.png',
        timeout: 6000,
        onClick: function () {
          window.focus();
          this.close();
        }
      });
    });

    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
    });
  }
  toggleSidebar(): void {
    this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
  }
}
