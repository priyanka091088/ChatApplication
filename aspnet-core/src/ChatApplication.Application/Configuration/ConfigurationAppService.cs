using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Runtime.Session;
using ChatApplication.Configuration.Dto;

namespace ChatApplication.Configuration
{
    [AbpAuthorize]
    public class ConfigurationAppService : ChatApplicationAppServiceBase, IConfigurationAppService
    {
        public async Task ChangeUiTheme(ChangeUiThemeInput input)
        {
            await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
        }
    }
}
