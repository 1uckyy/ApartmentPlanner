var canvas = document.getElementById("canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

var context = canvas.getContext("2d");

context.strokeStyle = '#001EFF';

var Header = document.getElementById("header");
var addedElems = document.getElementById("added_elems");
var addedElemsContainer = document.getElementById("added_elems_container");

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

var Rect = function (img, x, y, w, h, angle) {
    this.x = x;
    this.y = y;
    this.prevX = x + w / 2;
    this.prevY = y + h / 2;
    this.w = w;
    this.h = h;
    this.img = new Image();
    this.img.src = img;
    this.angle = angle;
}

Rect.prototype = {
    returnX: function () {
        return this.x;
    },

    returnY: function () {
        return this.y;
    },

    contextSet: function () {
        let newX = this.returnX() + this.w / 2;
        let newY = this.returnY() + this.h / 2;
        context.translate(newX, newY);
        context.rotate(this.angle * Math.PI / 180);
    },

    contextUnset: function () {
        let newX = this.returnX() + this.w / 2;
        let newY = this.returnY() + this.h / 2;
        context.rotate(-this.angle * Math.PI / 180);
        context.translate(-newX, -newY);
    },

    draw: function () {
        context.drawImage(this.img, -this.w / 2, -this.h / 2, this.w, this.h);
    },

    stroke: function () {
        context.strokeRect(-this.w / 2, -this.h / 2, this.w, this.h);
    }
}

var i, rects = [], count = 0, strokeRect = false;

function add(imgSrc) {
    rects.push(new Rect(imgSrc, 300, 300, 100, 107, 0));

    let item = document.createElement("div");
    item.setAttribute("class", "added_elem");
    item.setAttribute("id", "item" + count);

    let test = count;
    item.onmouseover = () => { strokeRect = rects[test]; }
    item.onmouseout = () => { strokeRect = false }

    let img = document.createElement("img");
    img.setAttribute("src", imgSrc);
    img.setAttribute("class", "img_added_elem");

    count++;
    let textField = document.createElement("input");
    textField.setAttribute("value", "Item " + count);
    textField.setAttribute("class", "textfield_added_elem");

    let burger_params = document.createElement("div");
    burger_params.setAttribute("class", "burger_params");
    burger_params.setAttribute("onclick", "addParams(" + (count - 1) + ")");
    let burger_params_line = document.createElement("div");
    burger_params_line.setAttribute("class", "burger_params_line");
    burger_params.appendChild(burger_params_line);

    item.appendChild(img);
    item.appendChild(textField);
    item.appendChild(burger_params);
    addedElemsContainer.appendChild(item);
}

function addParams(id) {
    var item = document.getElementById("item" + id);

    if (item.querySelector("div.params_box")) {
        let findParamsBox = item.lastChild;
        item.removeChild(findParamsBox);

        let burgerParams = item.querySelector("div.burger_to_x");
        burgerParams.removeAttribute("class");
        burgerParams.setAttribute("class", "burger_params_line");
    } else {
        let paramsBox = document.createElement("div");
        paramsBox.setAttribute("class", "params_box");
        paramsBox.setAttribute("style", "width: 100%; height: 80px; display: flex; flex-direction: row-reverse;");

        //поля с коориднатами
        let XYBox = document.createElement("div");
        XYBox.setAttribute("class", "XYBox");

        let labelAndInputX = document.createElement("div");
        let labelX = document.createElement("label");
        labelX.innerText = "X: ";
        let textFieldX = document.createElement("input");
        textFieldX.setAttribute("class", "text_field_params_box");
        textFieldX.setAttribute("value", rects[id].x);
        textFieldX.setAttribute("id", "inputx" + id);
        textFieldX.setAttribute("oninput", "inputX(" + id + ")");
        labelAndInputX.appendChild(labelX);
        labelAndInputX.appendChild(textFieldX);

        let labelAndInputY = document.createElement("div");
        let labelY = document.createElement("label");
        labelY.innerText = "Y: ";
        let textFieldY = document.createElement("input");
        textFieldY.setAttribute("class", "text_field_params_box");
        textFieldY.setAttribute("value", rects[id].y);
        textFieldY.setAttribute("id", "inputy" + id);
        textFieldY.setAttribute("oninput", "inputY(" + id + ")");
        labelAndInputY.appendChild(labelY);
        labelAndInputY.appendChild(textFieldY);

        XYBox.appendChild(labelAndInputX);
        XYBox.appendChild(labelAndInputY);

        //поля с шириной и высотой
        let WHBox = document.createElement("div");
        WHBox.setAttribute("class", "XYBox");

        let labelAndInputW = document.createElement("div");
        let labelW = document.createElement("label");
        labelW.innerText = "W: ";
        let textFieldW = document.createElement("input");
        textFieldW.setAttribute("class", "text_field_params_box");
        textFieldW.setAttribute("value", rects[id].w);
        textFieldW.setAttribute("id", "inputw" + id);
        textFieldW.setAttribute("oninput", "inputW(" + id + ")");
        labelAndInputW.appendChild(labelW);
        labelAndInputW.appendChild(textFieldW);

        let labelAndInputH = document.createElement("div");
        let labelH = document.createElement("label");
        labelH.innerText = "H: ";
        let textFieldH = document.createElement("input");
        textFieldH.setAttribute("class", "text_field_params_box");
        textFieldH.setAttribute("value", rects[id].h);
        textFieldH.setAttribute("id", "inputh" + id);
        textFieldH.setAttribute("oninput", "inputH(" + id + ")");
        labelAndInputH.appendChild(labelH);
        labelAndInputH.appendChild(textFieldH);

        WHBox.appendChild(labelAndInputW);
        WHBox.appendChild(labelAndInputH);

        paramsBox.appendChild(WHBox);
        paramsBox.appendChild(XYBox);
        item.appendChild(paramsBox);

        let burgerParams = item.querySelector("div.burger_params_line");
        burgerParams.removeAttribute("class");
        burgerParams.setAttribute("class", "burger_to_x");
    }
}

//ввод x
function inputX(id) {
    let textFieldX = document.getElementById("inputx" + id);
    rects[id].x = parseInt(textFieldX.value);
}

//ввод y
function inputY(id) {
    let textFieldY = document.getElementById("inputy" + id);
    rects[id].y = parseInt(textFieldY.value);
}

//ввод w
function inputW(id) {
    let textFieldW = document.getElementById("inputw" + id);
    rects[id].w = parseInt(textFieldW.value);
}

//ввод h
function inputH(id) {
    let textFieldH = document.getElementById("inputh" + id);
    rects[id].h = parseInt(textFieldH.value);
}

function clearContainer() {
    rects.splice(0);
    while (addedElemsContainer.firstChild != null) {
        count--;
        let elem = addedElemsContainer.firstChild;
        addedElemsContainer.removeChild(elem);
    }
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
        rects[i].contextSet();

        rects[i].draw();

        let item = document.getElementById("item" + i);
        //сброс фона добавленного элемента
        item.setAttribute("style", "");

        if (isCursorInRect(rects[i])) {
            //отрисовка синих границ объекта
            rects[i].stroke();

            //установка фона выбранного добавленного элемента
            item.setAttribute("style", "background-color: rgb(219, 226, 226);");
        }

        rects[i].contextUnset();
    }

    //отрисовка синих границ объекта, если навелись на item
    if (strokeRect != false) {
        strokeRect.contextSet();
        strokeRect.stroke();
        strokeRect.contextUnset();
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
    if (selected && selected.h >= 40 && selected.w >= 40) {
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
    mouse.x = e.pageX - addedElems.offsetWidth;
    mouse.y = e.pageY - Header.offsetHeight;

    for (i in rects) {
        //запись координат в поля x и y
        let textFieldX = document.getElementById("inputx" + i);
        let textFieldY = document.getElementById("inputy" + i);
        if (textFieldX != null || textFieldY != null) {
            textFieldX.value = rects[i].x;
            textFieldY.value = rects[i].y;
        }

        //запись параметров в поля w и h
        let textFieldW = document.getElementById("inputw" + i);
        let textFieldH = document.getElementById("inputh" + i);
        if (textFieldW != null || textFieldH != null) {
            textFieldW.value = rects[i].w;
            textFieldH.value = rects[i].h;
        }
    }

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