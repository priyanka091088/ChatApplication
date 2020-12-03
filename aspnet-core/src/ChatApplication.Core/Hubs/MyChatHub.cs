using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Abp.Runtime.Session;
using Castle.Core.Logging;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApplication.Hubs
{
    public class MyChatHub: AbpHubBase, ITransientDependency
    {
         public IAbpSession AbpSession { get; set; }

         public ILogger Logger { get; set; }

         public MyChatHub()
         {
             AbpSession = NullAbpSession.Instance;
             Logger = NullLogger.Instance;
         }

        public async Task SendMessage(string message)
        {
            var message1 = "admin" +message;
            await Clients.All.SendAsync("getMessage", string.Format("Your friend {0}: {1}", AbpSession.UserId, message1));
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            Logger.Debug("A client connected to MyChatHub: " + Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
            Logger.Debug("A client disconnected from MyChatHub: " + Context.ConnectionId);
        }
    }
}
