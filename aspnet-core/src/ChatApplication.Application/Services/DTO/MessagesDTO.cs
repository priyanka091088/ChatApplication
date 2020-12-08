using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApplication.Services.DTO
{
    public class MessagesDTO
    {
        public string message { get; set; }
        public int counter { get; set; }
        public long? senderId { get; set; }
        public long? receiverId { get; set; }
    }
}
