using System.Threading.Tasks;
using Abp.Application.Services;
using ChatApplication.Sessions.Dto;

namespace ChatApplication.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
    }
}
