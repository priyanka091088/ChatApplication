using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using ChatApplication.Configuration;
using ChatApplication.Web;

namespace ChatApplication.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class ChatApplicationDbContextFactory : IDesignTimeDbContextFactory<ChatApplicationDbContext>
    {
        public ChatApplicationDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<ChatApplicationDbContext>();
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

            ChatApplicationDbContextConfigurer.Configure(builder, configuration.GetConnectionString(ChatApplicationConsts.ConnectionStringName));

            return new ChatApplicationDbContext(builder.Options);
        }
    }
}
