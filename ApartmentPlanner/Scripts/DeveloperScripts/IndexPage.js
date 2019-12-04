//переход на страницу проектировки
document.getElementById("begin_plan").onclick = function () {
    location.href = "/Home/Planner";
};

//переопределение картинки
var imgEarth = document.getElementById("earth");
imgEarth.src = "/images/IndexPage/earth.png";
