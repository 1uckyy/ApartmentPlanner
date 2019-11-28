using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity.EntityFramework;

namespace ApartmentPlanner.Models
{
    //класс пользователя наследует класс IdentityUser, который содержит функциональность пользователя(id, login, email, role и др.)
    public class User : IdentityUser
    {
        //также храним год рождения пользователя
        public int Year { get; set; }
        public User()
        {
        }
    }
}