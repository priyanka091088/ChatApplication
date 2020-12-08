using Abp;
using Abp.AspNetCore.SignalR.Hubs;
using Abp.Dependency;
using Abp.Notifications;
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
        public MyChatHub()
         {
             AbpSession = NullAbpSession.Instance;
           
         }
        public async Task SendMessage(string message)
        {
            var message1 = "admin" +message;
            await Clients.All.SendAsync("getMessage", string.Format("Your friend {0}: {1}", AbpSession.UserId, message1));
        }
    }
}
