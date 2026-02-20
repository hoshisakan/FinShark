using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;


namespace api.Dtos.Account
{
    public class LoginDto
    {
        [Required]
        public string Username { get; set;}
        [Required]
        [MinLength(12, ErrorMessage = "Password must be at least 12 characters long")]
        public string Password { get; set; } = string.Empty;
    }
}