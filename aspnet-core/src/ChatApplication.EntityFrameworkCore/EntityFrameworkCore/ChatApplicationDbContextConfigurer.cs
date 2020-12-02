using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace ChatApplication.EntityFrameworkCore
{
    public static class ChatApplicationDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<ChatApplicationDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<ChatApplicationDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}
