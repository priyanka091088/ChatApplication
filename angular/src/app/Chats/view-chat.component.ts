import { Component, Injector, OnInit } from '@angular/core';
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
    templateUrl: './view-chat.component.html',
    styleUrls: ['./view-chat.component.css']
  })
  export class ViewChatComponent extends PagedListingComponentBase<UserDto>{
    keyword = '';
    isActive: boolean | null;

    users: UserDto[] = [];
    userId:number;
    friendId:number;

    chatList:ChatDTO[]=[];
    chatDetails:ChatDTO[];
    userName:string;
    EditMyMessage:boolean=false;
    EditYourMessage:boolean=false;
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
          this.friendId = +params.get('id');
          console.log(this.friendId)

          this.userService.get(this.friendId).subscribe(
          res=>{
              this.userName=res.userName;
          }
      )
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
                this.chatList=this.chatDetails.filter(c=>c.senderId==this.userId && c.receiverId==this.friendId 
                    || c.receiverId==this.userId && c.senderId==this.friendId);
                console.log(this.chatList);
          }
        });
         /*for(var i=0;i<this.chatDetails.length;i++){
           if(this.chatDetails[i].isRead!=true){
            this.chatDetails[i].isRead=true;
            this.chatService.update(this.chatDetails[i]).subscribe(
              res=>{
                console.log("isread=true");
              }
            )
           }

         }*/
      });
        
      }
    
      protected delete(user: UserDto): void {
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
        //this.EditMyMessage=!this.EditMyMessage;
    }
  }