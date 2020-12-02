using Abp.Application.Services;
using ChatApplication.Services.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApplication.Services.Chats
{
    public interface IChatApplicationService:IAsyncCrudAppService<ChatDTO>
    {
    }
}
