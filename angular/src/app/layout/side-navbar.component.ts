import { ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { ChatDTO, ChatServiceProxy, UserDto, UserDtoPagedResultDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import * as $ from 'jquery';

import { finalize } from 'rxjs/operators';
import {Chat} from './chat.model';
class PagedUsersRequestDto extends PagedRequestDto {
    keyword: string;
    isActive: boolean | null;
  }
  
@Component({
    selector: 'side-navbar',
    templateUrl: './side-navbar.component.html',
    styleUrls: ['./side-navbar.component.css'],
    changeDetection: ChangeDetectionStrategy.Default
  })
  export class SideNavBarComponent extends PagedListingComponentBase<UserDto>{
    keyword = '';
    isActive: boolean | null;
    users: UserDto[] = [];
    chatDetails:ChatDTO[]=[];
    chatList:ChatDTO[];
    counter:number[]=[];
    userId:number;
   
    constructor(injector: Injector, private router: Router,private userService:UserServiceProxy,
      private appservice:AppSessionService,private chatService:ChatServiceProxy,private route:ActivatedRoute) {
        super(injector);
      }

    list(
        request: PagedUsersRequestDto,
        pageNumber: number,
        finishedCallback: Function
      ): void {
        request.keyword = this.keyword;
        request.isActive = this.isActive;
        this.route.paramMap.subscribe((params: ParamMap) => {

        let userdetail=this.appservice.user;
        this.userId=userdetail.id;
        console.log(this.userId);

        this.chatService
        .getAll(
          request.keyword,
          request.skipCount,
          request.maxResultCount
        )
        .pipe(
          finalize(() => {
            finishedCallback();
          })
        )
        .subscribe({
          next:res => {
              this.chatDetails = res.items;
        }
      });

        this.userService
          .getAll(
            request.keyword,
            request.isActive,
            request.skipCount,
            request.maxResultCount
          )
          .pipe(
            finalize(() => {
              finishedCallback();
            })
          )
          .subscribe({
            next:res => {

              
          $.getScript(AppConsts.appBaseUrl + '/assets/abp/abp.signalr-client.js', () => {

            var chatHub = null;
           
              abp.signalr.startConnection(abp.appPath + 'signalr-myChatHub',(connection)=> {
                chatHub = connection; // Save a reference to the hub
            
                connection.on('getFriendMessage',(message:string,object:Chat)=> { // Register for incoming messages
                  
                  console.log('received message: ' + message);
                 
                  abp.notify.info(message,"",{timer:8000});
                  
                  this.users = res.items;
                  
                  for(var i=0;i<this.users.length;i++){
          
                    if(object.receiverId==this.userId && this.users[i].id==object.senderId){
                        
                      this.counter[i]=object.counter;
                    }
                }
                });
                }).then(function (connection) {
                    abp.log.debug('Sent Message To Friend!');
                    abp.event.trigger('myChatHub.receivedMessage');
                   
                });        
            
          });
              
                this.users = res.items;
                console.log(this.users);

                for(var i=0;i<this.users.length;i++){
          
                  if(this.users[i].id!=this.userId){
                      this.chatList=this.chatDetails.filter(c=>c.isRead==false &&  (c.receiverId==this.userId && c.senderId==this.users[i].id));
                        console.log(this.chatList)
                    this.counter[i]=this.chatList.length;
                    
                  }
                }
          }
        });
    
        });
        
      }
      
     protected delete(user: UserDto): void {
      }
  }