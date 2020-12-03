import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { ChatDTO, ChatServiceProxy, UserDto, UserDtoPagedResultDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { EditChatDialogComponent } from '../edit-chat/edit-chat.component';

class PagedUsersRequestDto extends PagedRequestDto {
    keyword: string;
    isActive: boolean | null;
  }
  
@Component({
    selector: 'view-options',
    templateUrl: './view-options.component.html',
    
  })
  export class ViewOptionsComponent extends AppComponentBase implements OnInit{
    saving = false;
    chat=new ChatDTO();
    id:number;
    keyword = '';

    @Output() onSave = new EventEmitter<any>();

    constructor(injector: Injector, private router: Router,private userService:UserServiceProxy,public bsModalRef: BsModalRef,
        private appservice:AppSessionService,private chatService:ChatServiceProxy,private route:ActivatedRoute
        ,private _modalService: BsModalService)
         {super(injector);
      }
      

    ngOnInit(): void {
        this.chatService.get(this.id).subscribe(
            res=>{
                this.chat=res;
            }
        )
    }
    edit(id?:number): void {
        let createOrEditMessageDialog: BsModalRef;
        createOrEditMessageDialog = this._modalService.show(
        EditChatDialogComponent,
        {
          class: 'modal-lg',
          initialState:{
            id:id,
          }
        }
      );
      
      }
      delete(chat:ChatDTO):void{
        
              if (confirm(`Really delete the Message?`)) {
                this.chatService
                  .delete(chat.id)
                  .pipe(
                    finalize(() => {
                      abp.notify.success(this.l('Message Successfully Deleted'));
                      this.bsModalRef.hide();
                      this.onSave.emit();
                      
                    })
                  )
                  .subscribe(() => {
                    this.refresh();
                  });
              }
      }
      refresh(): void {
        window.location.reload();
    }
  }