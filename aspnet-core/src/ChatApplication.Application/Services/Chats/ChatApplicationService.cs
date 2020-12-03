using Abp.Application.Services;
using Abp.Domain.Repositories;
using ChatApplication.Authorization.Users;
using ChatApplication.Domain;
using ChatApplication.Hubs;
using ChatApplication.Services.DTO;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
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
            var user = await _userManager.FindByIdAsync(input.senderId.ToString());
            var chat = ObjectMapper.Map<Chat>(input);
            await _chat.InsertAsync(chat);
            CurrentUnitOfWork.SaveChanges();

            await _hubContext.Clients.User(input.receiverId.ToString()).SendAsync("getFriendMessage", string.Format("Your friend: {0} ", user.UserName));
            return MapToEntityDto(chat);
        }
        }
}
