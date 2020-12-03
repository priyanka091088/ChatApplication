import { Component, Injector, OnInit, Renderer2 } from '@angular/core';
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

  constructor(
    injector: Injector,
    private renderer: Renderer2,
    private _layoutStore: LayoutStoreService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'sidebar-mini');
    
    SignalRAspNetCoreHelper.initSignalR();
    
    $.getScript(AppConsts.appBaseUrl + '/assets/abp/abp.signalr-client.js', () => {

      var chatHub = null;
      /*abp.signalr.startConnection(abp.appPath + 'signalr-myChatHub', function (connection) {
        chatHub = connection; // Save a reference to the hub
    
        connection.on('getMessage', function (name:string) { // Register for incoming messages
          var message=name+ "sent you a message";  
          console.log('received message: ' + message);
        });
        }).then(function (connection) {
            abp.log.debug('Connected to myChatHub server!');
            abp.event.trigger('myChatHub.connected');
        });
        abp.event.on('myChatHub.connected', function() { // Register for connect event
          chatHub.invoke('sendMessage', "Hi everybody, I'm connected to the chat!"); // Send a message to the server
      });*/

        abp.signalr.startConnection(abp.appPath + 'signalr-myChatHub', function (connection) {
          chatHub = connection; // Save a reference to the hub
      
          connection.on('getFriendMessage', function (name:string) { // Register for incoming messages
            var message=name+ " sent you a message";  
            console.log('received message: ' + message);
            alert(message);
          });
          }).then(function (connection) {
              abp.log.debug('Sent Message To Friend!');
              abp.event.trigger('myChatHub.receivedMessage');
          });
    
        
         
        abp.event.on('myChatHub.receivedMessage', function() { // Register for connect event
          chatHub.invoke('sendMessage', "Sent You A message"); // Send a message to the server
      }); 
      
    });

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
