using Abp;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Notifications;
using ChatApplication.Authorization.Users;
using ChatApplication.Domain;
using ChatApplication.Hubs;
using ChatApplication.Services.DTO;
using ChatApplication.Users;
using ChatApplication.Users.Dto;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;

namespace ChatApplication.Services.Chats
{
    public class ChatApplicationService: AsyncCrudAppService<Chat,ChatDTO>,IChatApplicationService
    {
        private readonly IHubContext<MyChatHub> _hubContext;
        private readonly IRepository<Chat> _chat;
        private readonly UserManager _userManager;
        public ChatApplicationService(IRepository<Chat> repository,IRepository<Chat> chat, 
            IHubContext<MyChatHub> hubContext, UserManager userManager) :base(repository)
        {
            _chat = chat;
            _hubContext = hubContext;
            _userManager = userManager;
            
        }
        public override async Task<ChatDTO> CreateAsync(ChatDTO input)
        {
            int[] array = new int[] { };
            var user = await _userManager.FindByIdAsync(input.senderId.ToString());
            var chat = ObjectMapper.Map<Chat>(input);
            await _chat.InsertAsync(chat);
            CurrentUnitOfWork.SaveChanges();

            var chats = _chat.GetAll().Where(c => c.isRead == false && c.senderId == input.senderId && c.receiverId == input.receiverId).ToList();
            MessagesDTO obj = new MessagesDTO();
            obj.message = input.Message;
            obj.senderId = input.senderId;
            obj.receiverId = input.receiverId;
            obj.counter = chats.Count();
            

            await _hubContext.Clients.User(input.receiverId.ToString()).SendAsync
                ("getFriendMessage", string.Format("{0}  => {1} ", user.UserName,input.Message),obj);
            return MapToEntityDto(chat);
        }
        public override async Task<ChatDTO> UpdateAsync(ChatDTO input)
        {
            var chats = _chat.Get(input.Id);
            chats.isRead = true;
            await _chat.UpdateAsync(chats);
            CurrentUnitOfWork.SaveChanges();
            return MapToEntityDto(chats);

        }
    }
}
