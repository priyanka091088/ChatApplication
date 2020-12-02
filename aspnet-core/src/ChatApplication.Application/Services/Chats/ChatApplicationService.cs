using Abp.Application.Services;
using Abp.Domain.Repositories;
using ChatApplication.Domain;
using ChatApplication.Services.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApplication.Services.Chats
{
    public class ChatApplicationService: AsyncCrudAppService<Chat,ChatDTO>,IChatApplicationService
    {
        public ChatApplicationService(IRepository<Chat> repository):base(repository)
        {

        }
    }
}
