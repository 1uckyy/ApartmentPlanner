using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApartmentPlanner.Models
{
    //менеджер пользователей. UserManager позволяет управлять пользователями: создавать поль., удалять поль., менять пароль и др.
    public class AppUserManager : UserManager<User>
    {
        //конструктор принимает объект хранилища пользователей
        public AppUserManager(IUserStore<User> store) : base(store)
        {
        }

        //создание экземпляра класса
        public static AppUserManager Create(IdentityFactoryOptions<AppUserManager> options, IOwinContext context)
        {
            AppContext db = context.Get<AppContext>();
            AppUserManager manager = new AppUserManager(new UserStore<User>(db));
            return manager;
        }
    }
}