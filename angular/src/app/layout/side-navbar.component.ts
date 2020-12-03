import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { ChatDTO, ChatServiceProxy, UserDto, UserDtoPagedResultDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

class PagedUsersRequestDto extends PagedRequestDto {
    keyword: string;
    isActive: boolean | null;
  }
  
@Component({
    selector: 'side-navbar',
    templateUrl: './side-navbar.component.html',
    styleUrls: ['./side-navbar.component.css']
  })
  export class SideNavBarComponent extends PagedListingComponentBase<UserDto>{
    private updateSubscription: Subscription;

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
                this.users = res.items;
                console.log(this.users);

                for(var i=0;i<this.users.length;i++){
          
                  if(this.users[i].id!=this.userId){
                    console.log(this.users[i].id)
                      this.chatList=this.chatDetails.filter(c=>c.isRead==false && ((c.senderId==this.userId && c.receiverId==this.users[i].id) 
                        || (c.receiverId==this.userId && c.senderId==this.users[i].id)));
                        console.log(this.chatList)
                    this.counter[i]=this.chatList.length;
                    
                  }
                }
                console.log(this.counter);
               
          }
        });
        });
        
      }
      
      protected delete(user: UserDto): void {
      }
  }