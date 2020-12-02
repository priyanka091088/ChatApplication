using Abp.AspNetCore.Mvc.Controllers;
using Abp.IdentityFramework;
using Microsoft.AspNetCore.Identity;

namespace ChatApplication.Controllers
{
    public abstract class ChatApplicationControllerBase: AbpController
    {
        protected ChatApplicationControllerBase()
        {
            LocalizationSourceName = ChatApplicationConsts.LocalizationSourceName;
        }

        protected void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }
    }
}
