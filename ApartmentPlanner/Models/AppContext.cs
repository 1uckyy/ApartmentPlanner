using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace ApartmentPlanner.Models
{
    //контекст данных. IdentityDbContext для управления пользователями (Users) и ролями (Roles)
    public class AppContext : IdentityDbContext<User>
    {
        //относится к строке подключения name="IdentityDb"
        public AppContext() : base("IdentityDb") { }

        public static AppContext Create()
        {
            return new AppContext();
        }
    }
}