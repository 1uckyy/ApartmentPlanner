using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ApartmentPlanner.Helpers
{
    public static class ListFurnitureHelper
    {
        public static MvcHtmlString CreateList(this HtmlHelper html, string ImgSrc)
        {
            TagBuilder div = new TagBuilder("div");
            div.AddCssClass("furniture_item");

            TagBuilder img = new TagBuilder("img");
            img.MergeAttribute("src", "/images/PlannerPage/FurnitureItems/" + ImgSrc);
            img.MergeAttribute("alt", "furniture item");
            img.AddCssClass("img_fur_item");

            TagBuilder circle_add = new TagBuilder("div");
            circle_add.AddCssClass("circle_add");
            circle_add.MergeAttribute("onclick", "add('/images/PlannerPage/FurnitureItems/" + ImgSrc + "')");

            TagBuilder horiz_line = new TagBuilder("div");
            horiz_line.AddCssClass("horiz_line");

            TagBuilder vert_line = new TagBuilder("div");
            vert_line.AddCssClass("vert_line");

            circle_add.InnerHtml += horiz_line.ToString();
            circle_add.InnerHtml += vert_line.ToString();

            div.InnerHtml += img.ToString();
            div.InnerHtml += circle_add.ToString();
            return new MvcHtmlString(div.ToString());
        }
    }
}