using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using ChatApplication.Authorization.Users;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApplication.Domain
{
    public class Chat: FullAuditedEntity
    {
        [Required]
        public string Message { get; set; }
        //public virtual DateTime CreationTime { get; set; }
        public bool isRead { get; set; }

        public long? senderId { get; set; }
        [ForeignKey("senderId ")]
        public User Sender { get; set; }

        public long? receiverId { get; set; }
        [ForeignKey("receiverId ")]
        public User Receiver { get; set; }

        /*public Chat()
        {
            CreationTime = DateTime.Now;
        }*/
    }
}
