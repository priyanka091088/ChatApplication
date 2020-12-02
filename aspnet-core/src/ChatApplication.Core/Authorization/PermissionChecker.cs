using Abp.Authorization;
using ChatApplication.Authorization.Roles;
using ChatApplication.Authorization.Users;

namespace ChatApplication.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {
        }
    }
}
