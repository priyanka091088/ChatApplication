using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Abp.Modules;
using Abp.Reflection.Extensions;
using ChatApplication.Configuration;

namespace ChatApplication.Web.Host.Startup
{
    [DependsOn(
       typeof(ChatApplicationWebCoreModule))]
    public class ChatApplicationWebHostModule: AbpModule
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfigurationRoot _appConfiguration;

        public ChatApplicationWebHostModule(IWebHostEnvironment env)
        {
            _env = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(ChatApplicationWebHostModule).GetAssembly());
        }
    }
}
