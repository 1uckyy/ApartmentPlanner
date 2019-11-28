using System;
using System.Threading.Tasks;
using ApartmentPlanner.Models;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;


[assembly: OwinStartup(typeof(ApartmentPlanner.App_Start.Startup))]

namespace ApartmentPlanner.App_Start
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // настраиваем контекст и менеджер
            app.CreatePerOwinContext<Models.AppContext>(Models.AppContext.Create);
            app.CreatePerOwinContext<AppUserManager>(AppUserManager.Create);
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login"),
            });
        }
    }
}
