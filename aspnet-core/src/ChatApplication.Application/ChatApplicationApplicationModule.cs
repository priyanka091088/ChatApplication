using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using ChatApplication.Authorization;

namespace ChatApplication
{
    [DependsOn(
        typeof(ChatApplicationCoreModule), 
        typeof(AbpAutoMapperModule))]
    public class ChatApplicationApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Authorization.Providers.Add<ChatApplicationAuthorizationProvider>();
        }

        public override void Initialize()
        {
            var thisAssembly = typeof(ChatApplicationApplicationModule).GetAssembly();

            IocManager.RegisterAssemblyByConvention(thisAssembly);

            Configuration.Modules.AbpAutoMapper().Configurators.Add(
                // Scan the assembly for classes which inherit from AutoMapper.Profile
                cfg => cfg.AddMaps(thisAssembly)
            );
        }
    }
}
