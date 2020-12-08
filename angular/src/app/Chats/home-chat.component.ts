import { getLocaleDateTimeFormat } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { ChatDTO, ChatServiceProxy, UserDto, UserDtoPagedResultDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { SendChatDialogComponent } from './send-chat/send-chat-dialog.component';
import { ViewOptionsComponent } from './view-options/view-options.component';

class PagedUsersRequestDto extends PagedRequestDto {
    keyword: string;
    isActive: boolean | null;
  }
  
@Component({
    selector: 'view-chat',
    templateUrl: './home-chat.component.html',
    styleUrls: ['./home-chat.component.css'],
    changeDetection: ChangeDetectionStrategy.Default
  })
  export class HomeChatComponent extends PagedListingComponentBase<ChatDTO>{
    keyword = '';
    isActive: boolean | null;

    users: UserDto[] = [];
    userId:number;
    friendId:number;

    chat=new ChatDTO();
    chatDetails:ChatDTO[]=[];
    showChat:ChatDTO[]=[];
    chatList:ChatDTO[];
    
    userName:string;
    counter:number[]=[];

    constructor(injector: Injector, private router: Router,private userService:UserServiceProxy,
        private appservice:AppSessionService,private chatService:ChatServiceProxy,private route:ActivatedRoute
        ,private _modalService: BsModalService) {
        super(injector);
      }
    list(
        request: PagedUsersRequestDto,
        pageNumber: number,
        finishedCallback: Function
      ): void {
        request.keyword = this.keyword;
       
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
              this.chatDetails=res.items;
              console.log(this.chatDetails)
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
                      this.chatList=this.chatDetails.filter(c=>c.isRead==false &&  (c.receiverId==this.userId && c.senderId==this.users[i].id));
                        console.log(this.chatList)
                    this.counter[i]=this.chatList.length;
                    
                  }
                }
                console.log(this.counter);
          }
        });
        
      });
        
      }
      refreshPage(): void {
        window.location.reload();
    }
      protected delete(chat: ChatDTO): void {
      }

      SendMessage(id?:number): void {
        let createOrEditMessageDialog: BsModalRef;
        createOrEditMessageDialog = this._modalService.show(
        SendChatDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
      createOrEditMessageDialog.content.onSave.subscribe(() => {
        this.refresh();
      });
    }
    ShowOptions(id?:number){
        let createOrEditMessageDialog: BsModalRef;
        createOrEditMessageDialog = this._modalService.show(
        ViewOptionsComponent,
        {
          class: 'modal-lg',
          initialState:{
            id:id,
          }
        }
      );
       
    }
  }