using System.ComponentModel.DataAnnotations;

namespace ChatApplication.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}