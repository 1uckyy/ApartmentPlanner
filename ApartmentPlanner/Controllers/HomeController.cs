using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ApartmentPlanner.Models;

namespace ApartmentPlanner.Controllers
{
    public class HomeController : Controller
    {
        Models.AppContext db = new Models.AppContext();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult PartialChangeLang()
        {
            return PartialView();
        }

        public ActionResult Planner()
        {
            return View(db.FurnitureItemModels);
        }
    }
}