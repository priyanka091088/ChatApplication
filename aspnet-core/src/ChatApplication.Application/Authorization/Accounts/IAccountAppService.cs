using System.Threading.Tasks;
using Abp.Application.Services;
using ChatApplication.Authorization.Accounts.Dto;

namespace ChatApplication.Authorization.Accounts
{
    public interface IAccountAppService : IApplicationService
    {
        Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

        Task<RegisterOutput> Register(RegisterInput input);
    }
}
