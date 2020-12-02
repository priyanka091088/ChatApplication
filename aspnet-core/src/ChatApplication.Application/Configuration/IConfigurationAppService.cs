using System.Threading.Tasks;
using ChatApplication.Configuration.Dto;

namespace ChatApplication.Configuration
{
    public interface IConfigurationAppService
    {
        Task ChangeUiTheme(ChangeUiThemeInput input);
    }
}
