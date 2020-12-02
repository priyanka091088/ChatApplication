import {
    Component,
    Injector,
    OnInit,
    EventEmitter,
    Output,
  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import {  ChatDTO, ChatServiceProxy, PermissionDto } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';

  @Component({
    templateUrl: 'send-chat-dialog.component.html'
  })
  export class SendChatDialogComponent extends AppComponentBase implements OnInit{
    saving = false;
    id:number;
    chatDetails:ChatDTO[]=[];
    chat=new ChatDTO();
    permissions: PermissionDto[] = [];
    checkedPermissionsMap: { [key: string]: boolean } = {};
    defaultPermissionCheckedStatus = true;
    userId:number;
    friendId:number;
    @Output() onSave = new EventEmitter<any>();

    constructor(injector: Injector,
        private chatService:ChatServiceProxy,
        public bsModalRef: BsModalRef,private route:ActivatedRoute,
        private router:Router,private appservice:AppSessionService){
        super(injector);
    }
      ngOnInit(): void {
        console.log(this.id)

        let userdetail=this.appservice.user;
        this.userId=userdetail.id;
        console.log(this.userId);
      }
      save(): void {
        this.saving = true;
    
        const chat = new ChatDTO();
        chat.init(this.chat);
        chat.senderId=this.userId;
        chat.receiverId=this.id;
        chat.isRead=false;
        this.chatService
          .create(chat)
          .pipe(
            finalize(() => {
              this.saving = false;
            })
          )
          .subscribe(() => {
            this.notify.info(this.l('sent Successfully'));
            this.bsModalRef.hide();
            this.onSave.emit();
          });
      }
      Back():void{
          this.bsModalRef.hide();
      }
}
