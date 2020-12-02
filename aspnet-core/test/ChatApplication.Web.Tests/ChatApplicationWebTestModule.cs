using Abp.AspNetCore;
using Abp.AspNetCore.TestBase;
using Abp.Modules;
using Abp.Reflection.Extensions;
using ChatApplication.EntityFrameworkCore;
using ChatApplication.Web.Startup;
using Microsoft.AspNetCore.Mvc.ApplicationParts;

namespace ChatApplication.Web.Tests
{
    [DependsOn(
        typeof(ChatApplicationWebMvcModule),
        typeof(AbpAspNetCoreTestBaseModule)
    )]
    public class ChatApplicationWebTestModule : AbpModule
    {
        public ChatApplicationWebTestModule(ChatApplicationEntityFrameworkModule abpProjectNameEntityFrameworkModule)
        {
            abpProjectNameEntityFrameworkModule.SkipDbContextRegistration = true;
        } 
        
        public override void PreInitialize()
        {
            Configuration.UnitOfWork.IsTransactional = false; //EF Core InMemory DB does not support transactions.
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(ChatApplicationWebTestModule).GetAssembly());
        }
        
        public override void PostInitialize()
        {
            IocManager.Resolve<ApplicationPartManager>()
                .AddApplicationPartsIfNotAddedBefore(typeof(ChatApplicationWebMvcModule).Assembly);
        }
    }
}