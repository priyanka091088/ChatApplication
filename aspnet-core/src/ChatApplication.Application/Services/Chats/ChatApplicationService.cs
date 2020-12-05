using Abp;
using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Notifications;
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
        private readonly INotificationPublisher _notificationPublisher;
        INotificationSubscriptionManager _notificationSubscriptionManager;
        public ChatApplicationService(IRepository<Chat> repository,IRepository<Chat> chat, 
            IHubContext<MyChatHub> hubContext, UserManager userManager, 
            INotificationPublisher notificationPublisher, INotificationSubscriptionManager notificationSubscriptionManager) :base(repository)
        {
            _chat = chat;
            _hubContext = hubContext;
            _userManager = userManager;
            _notificationPublisher = notificationPublisher;
            _notificationSubscriptionManager = notificationSubscriptionManager;
        }
        public override async Task<ChatDTO> CreateAsync(ChatDTO input)
        {
            var user = await _userManager.FindByIdAsync(input.senderId.ToString());
            var chat = ObjectMapper.Map<Chat>(input);
            await _chat.InsertAsync(chat);
            CurrentUnitOfWork.SaveChanges();

            await _hubContext.Clients.User(input.receiverId.ToString()).SendAsync("getFriendMessage", string.Format("{0}  => {1} ", user.UserName,input.Message));
            
           // UserIdentifier identifier = new UserIdentifier(AbpSession.TenantId, user.Id);
            //await _notificationSubscriptionManager.SubscribeAsync(new UserIdentifier(1, user.Id), "NewMessage");
            //await _notificationPublisher.PublishAsync("NewMessage", new SentFrendshipRequestNotificationData("Test", "New Message"), userIds: new[] { identifier });

            return MapToEntityDto(chat);
        }
        }
}
