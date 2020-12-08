using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using ChatApplication.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApplication.Services.DTO
{
    [AutoMap(typeof(Chat))]
   public class ChatDTO:FullAuditedEntityDto
    {
        public string Message { get; set; }
        public bool isRead { get; set; }
        public long? senderId { get; set; }
        public long? receiverId { get; set; }
    }
}
