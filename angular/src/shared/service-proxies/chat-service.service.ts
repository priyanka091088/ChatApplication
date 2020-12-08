import { Injectable } from "@angular/core";
import { Chat } from "@app/layout/chat.model";
import { AppConsts } from "@shared/AppConsts";
import { SignalRAspNetCoreHelper } from "@shared/helpers/SignalRAspNetCoreHelper";


@Injectable({
    providedIn: 'root'
  })
  export class ChatServivce {
    chat:Chat;

    constructor() { }

    getNotification(){
        SignalRAspNetCoreHelper.initSignalR();

        $.getScript(AppConsts.appBaseUrl + '/assets/abp/abp.signalr-client.js', () => {

            var chatHub = null;
           
              abp.signalr.startConnection(abp.appPath + 'signalr-myChatHub', function (connection) {
                chatHub = connection; // Save a reference to the hub
            
                connection.on('getFriendMessage', function (message:string) { // Register for incoming messages
                  
                  console.log('received message: ' + message);
                 
                  return message;
                 // abp.notify.info(message,"",{timer:10000});
                  
                  
                  /*this.interval = setInterval(() => {
                    if(this.timeLeft > 0) {
                      this.timeLeft--;
                    } else {
                      window.location.reload();
                      clearInterval(this.interval);
                    }
                  },1000)*/
                 
                });
                }).then(function (connection) {
                    abp.log.debug('Sent Message To Friend!');
                    abp.event.trigger('myChatHub.receivedMessage');
                   
                });        
               
              abp.event.on('myChatHub.receivedMessage', function() { // Register for connect event
                chatHub.invoke('sendMessage', "Sent You A message"); // Send a message to the server
            });
            
          });
        
    }

    
  }