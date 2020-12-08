import { EventEmitter, Injectable } from "@angular/core";
import { Chat } from "@app/layout/chat.model";
import { AppConsts } from "@shared/AppConsts";
import { SignalRAspNetCoreHelper } from "@shared/helpers/SignalRAspNetCoreHelper";
import * as $ from 'jquery';

@Injectable({
    providedIn: 'root'
  })
  export class ChatServivce {
    chat=new EventEmitter<Chat>();

    constructor() { }

    getNotification(){
        SignalRAspNetCoreHelper.initSignalR();

        $.getScript(AppConsts.appBaseUrl + '/assets/abp/abp.signalr-client.js', () => {

            var chatHub = null;
           
              abp.signalr.startConnection(abp.appPath + 'signalr-myChatHub',(connection)=> {
                chatHub = connection; // Save a reference to the hub
            
                connection.on('getFriendMessage',(message:string,chats:Chat) =>{ // Register for incoming messages
                  
                  console.log('received message: ' + message);
                 abp.notify.info(message,"",{timer:10000});
                  this.chat.emit()
                 
                });
                })
                
             });
            
        
    }

    
  }