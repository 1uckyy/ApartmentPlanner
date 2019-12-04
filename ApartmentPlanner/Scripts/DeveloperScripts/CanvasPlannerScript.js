var canvas = document.getElementById("canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var context = canvas.getContext("2d");

context.strokeStyle = '#001EFF';

var Header = document.getElementById("header");
var added_elems = document.getElementById("added_elems");

var mouse = {
    x: 0,
    y: 0
};

//мышка зажата над объектом
var selected = false;
//вспом. перем. для изменения размеров
var changeSizeXLeft = false;
var changeSizeXRight = false;
var changeSizeYTop = false;
var changeSizeYBottom = false;

var Rect = function (img, x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = new Image();
    this.img.src = img;
}

Rect.prototype = {
    draw: function () {
        context.drawImage(this.img, this.x, this.y, this.w, this.h);
    },

    stroke: function () {
        context.strokeRect(this.x, this.y, this.w, this.h);
    }
}

var i, rects = [];

function add(imgSrc) {
    rects.push(new Rect(imgSrc, 100, 100, 100, 107));
}

function clearr() {
    rects.splice(0);
}

var isCursorInRect = (rect) => {
    let rectRight = rect.x + rect.w;
    let rectBottom = rect.y + rect.h;

    //курсор resize
    if (mouse.x - rect.x < 10 && mouse.y - rect.y > 10 && (rectBottom - mouse.y) > 10 && mouse.x - rect.x > 0)
        canvas.style.cursor = "w-resize";
    if (mouse.y - rect.y < 10 && mouse.x - rect.x < 10 && mouse.x - rect.x > 0 && mouse.y - rect.y > 0)
        canvas.style.cursor = "nw-resize";
    if (mouse.y - rect.y < 10 && mouse.x - rect.x > 10 && (rectRight - mouse.x) > 10 && mouse.y - rect.y > 0)
        canvas.style.cursor = "n-resize";
    if (mouse.y - rect.y < 10 && rectRight - mouse.x < 10 && rectRight - mouse.x > 0 && mouse.y - rect.y > 0)
        canvas.style.cursor = "ne-resize";
    if (rectRight - mouse.x < 10 && mouse.y - rect.y > 10 && (rectBottom - mouse.y) > 10 && rectRight - mouse.x > 0)
        canvas.style.cursor = "e-resize";
    if (rectBottom - mouse.y < 10 && rectRight - mouse.x < 10 && rectRight - mouse.x > 0 && rectBottom - mouse.y > 0)
        canvas.style.cursor = "se-resize";
    if (rectBottom - mouse.y < 10 && mouse.x - rect.x > 10 && (rectRight - mouse.x) > 10 && rectBottom - mouse.y > 0)
        canvas.style.cursor = "s-resize";
    if (rectBottom - mouse.y < 10 && mouse.x - rect.x < 10 && mouse.x - rect.x > 0 && rectBottom - mouse.y > 0)
        canvas.style.cursor = "sw-resize";

    //курсор move
    if ((mouse.x - rect.x > 10) && (mouse.y - rect.y > 10) && ((rectRight - mouse.x) > 10) &&
        ((rectBottom - mouse.y) > 10)) {
        canvas.style.cursor = "move";
    }


    return (mouse.x > rect.x) && (mouse.x < rectRight) && (mouse.y > rect.y) && (mouse.y < rectBottom);
}

setInterval(() => {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    canvas.style.cursor = "default";

    for (i in rects) {
        rects[i].draw();

        if (isCursorInRect(rects[i])) {
            rects[i].stroke();
        }
    }

    //перемещение объекта
    if (selected && (mouse.x - selected.x > 10) && (mouse.y - selected.y > 10) && (((selected.x + selected.w) - mouse.x) > 10) &&
        (((selected.y + selected.h) - mouse.y) > 10)) {
        if ((mouse.x + selected.w / 2) < canvasWidth && (mouse.x - selected.w / 2) > 0) {
            selected.x = mouse.x - selected.w / 2;
        }
        if ((mouse.y + selected.h / 2) < canvasHeight && (mouse.y - selected.h / 2) > 0) {
            selected.y = mouse.y - selected.h / 2;
        }
    }

    //не применять если высота или ширина слишком маленькие
    if (selected.h >= 40 && selected.w >= 40) {
        //изменение размера объекта
        //влево
        if (changeSizeXLeft) {
            if (selected.x > mouse.x) {
                selected.w += selected.x - mouse.x;
                selected.x = mouse.x;
            }
            if (selected.x < mouse.x) {
                selected.w -= mouse.x - selected.x;
                selected.x = mouse.x;
            }
        }

        //вправо
        if (changeSizeXRight) {
            let selectedXRight = selected.x + selected.w;
            if (selectedXRight > mouse.x)
                selected.w -= selectedXRight - mouse.x;
            if (selectedXRight < mouse.x)
                selected.w += mouse.x - selectedXRight;
        }

        //наверх
        if (changeSizeYTop) {
            if (selected.y > mouse.y) {
                selected.h += selected.y - mouse.y;
                selected.y = mouse.y;
            }
            if (selected.y < mouse.y) {
                selected.h -= mouse.y - selected.y;
                selected.y = mouse.y;
            }
        }

        //вниз
        if (changeSizeYBottom) {
            let selectedYBottom = selected.y + selected.h;
            if (selectedYBottom > mouse.y)
                selected.h -= selectedYBottom - mouse.y;
            if (selectedYBottom < mouse.y)
                selected.h += mouse.y - selectedYBottom;
        }
    } else {
        if (selected.h < 40)
            selected.h = 40;
        if (selected.w < 40)
            selected.w = 40;
    }
}, 1);

canvas.onmousemove = function (e) {
    mouse.x = e.pageX - added_elems.offsetWidth;
    mouse.y = e.pageY - Header.offsetHeight;

    if (selected) {
        if (mouse.x - selected.x < 10) {
            changeSizeXLeft = true;
        }
        if ((selected.x + selected.w) - mouse.x < 10) {
            changeSizeXRight = true;
        }
        if (mouse.y - selected.y < 10) {
            changeSizeYTop = true;
        }
        if (((selected.y + selected.h) - mouse.y) < 10) {
            changeSizeYBottom = true;
        }
    }
}

canvas.onmouseout = function () {
    selected = false;

    changeSizeXLeft = false;
    changeSizeXRight = false;
    changeSizeYTop = false;
    changeSizeYBottom = false;
}

canvas.onmousedown = function () {
    if (!selected) {
        var i;
        for (i in rects) {
            if (isCursorInRect(rects[i])) {
                selected = rects[i];
            }
        }
    }
}

canvas.onmouseup = function () {
    selected = false;

    changeSizeXLeft = false;
    changeSizeXRight = false;
    changeSizeYTop = false;
    changeSizeYBottom = false;
}