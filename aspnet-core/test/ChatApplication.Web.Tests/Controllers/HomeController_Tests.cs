using System.Threading.Tasks;
using ChatApplication.Models.TokenAuth;
using ChatApplication.Web.Controllers;
using Shouldly;
using Xunit;

namespace ChatApplication.Web.Tests.Controllers
{
    public class HomeController_Tests: ChatApplicationWebTestBase
    {
        [Fact]
        public async Task Index_Test()
        {
            await AuthenticateAsync(null, new AuthenticateModel
            {
                UserNameOrEmailAddress = "admin",
                Password = "123qwe"
            });

            //Act
            var response = await GetResponseAsStringAsync(
                GetUrl<HomeController>(nameof(HomeController.Index))
            );

            //Assert
            response.ShouldNotBeNullOrEmpty();
        }
    }
}