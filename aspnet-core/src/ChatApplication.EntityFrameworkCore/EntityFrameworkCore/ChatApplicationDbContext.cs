using Microsoft.EntityFrameworkCore;
using Abp.Zero.EntityFrameworkCore;
using ChatApplication.Authorization.Roles;
using ChatApplication.Authorization.Users;
using ChatApplication.MultiTenancy;
using ChatApplication.Domain;

namespace ChatApplication.EntityFrameworkCore
{
    public class ChatApplicationDbContext : AbpZeroDbContext<Tenant, Role, User, ChatApplicationDbContext>
    {
        /* Define a DbSet for each entity of the application */
        public DbSet<Chat> Chats { get; set; }
        
        public ChatApplicationDbContext(DbContextOptions<ChatApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
