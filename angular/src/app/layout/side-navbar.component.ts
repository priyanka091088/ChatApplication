import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { UserDto, UserDtoPagedResultDto, UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
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
    keyword = '';
    isActive: boolean | null;
    users: UserDto[] = [];
    userId:number;
    constructor(injector: Injector, private router: Router,private userService:UserServiceProxy,private appservice:AppSessionService) {
        super(injector);
      }
    list(
        request: PagedUsersRequestDto,
        pageNumber: number,
        finishedCallback: Function
      ): void {
        request.keyword = this.keyword;
        request.isActive = this.isActive;

        let userdetail=this.appservice.user;
        this.userId=userdetail.id;
        console.log(this.userId);

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
                //console.log(this.users[0].id)
          }
        });
      }
    
      protected delete(user: UserDto): void {
      }
  }