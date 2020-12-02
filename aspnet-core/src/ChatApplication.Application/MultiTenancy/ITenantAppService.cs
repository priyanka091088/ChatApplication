using Abp.Application.Services;
using ChatApplication.MultiTenancy.Dto;

namespace ChatApplication.MultiTenancy
{
    public interface ITenantAppService : IAsyncCrudAppService<TenantDto, int, PagedTenantResultRequestDto, CreateTenantDto, TenantDto>
    {
    }
}

