var canvas = document.getElementById("canvas");
canvas.addEventListener('wheel', zoom);
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

var camera = {
    x: 0,
    y: 0,

    move: function (x, y) {
        this.x += x;
        this.y += y;
    }
}

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
        context.drawImage(this.img, -this.w / 2 - camera.x, -this.h / 2 - camera.y, this.w, this.h);
    },

    stroke: function () {
        context.strokeRect(-this.w / 2 - camera.x, -this.h / 2 - camera.y, this.w, this.h);
    }
}

var i, rects = [], count = 0, strokeRect = false, namesArray = [];

function add(imgSrc) {
    rects.push(new Rect(imgSrc, 0, 0, 1000, 1000, 0));

    let item = document.createElement("div");
    item.setAttribute("class", "added_elem");
    item.setAttribute("id", "item" + count);

    let test = count;
    item.onmouseover = () => { strokeRect = rects[test]; }
    item.onmouseout = () => { strokeRect = false }

    let deleteItem = document.createElement("img");
    deleteItem.setAttribute("src", "/images/PlannerPage/remove.png");
    deleteItem.setAttribute("class", "delete_item_img");
    deleteItem.setAttribute("onclick", "deleteItem(" + count + ")");

    let img = document.createElement("img");
    img.setAttribute("src", imgSrc);
    img.setAttribute("class", "img_added_elem");

    let burger_params = document.createElement("div");
    burger_params.setAttribute("class", "burger_params");
    burger_params.setAttribute("onclick", "addParams(" + count + ")");
    let burger_params_line = document.createElement("div");
    burger_params_line.setAttribute("class", "burger_params_line");
    burger_params.appendChild(burger_params_line);

    count++;
    let textField = document.createElement("input");
    textField.setAttribute("class", "textfield_added_elem");
    calculationItemName(textField);

    item.appendChild(deleteItem);
    item.appendChild(img);
    item.appendChild(textField);
    item.appendChild(burger_params);
    addedElemsContainer.appendChild(item);
}

//вычисление названия item'a
function calculationItemName(textField) {
    if (namesArray.length == 0) {
        namesArray.push(1);
        textField.setAttribute("value", "Item " + 1);
    } else if (namesArray.length == 1) {
        if (namesArray[0] > 1) {
            textField.setAttribute("value", "Item " + 1);
            namesArray.push(1);
        } else {
            textField.setAttribute("value", "Item " + 2);
            namesArray.push(2);
        }
    } else {
        namesArray.sort();
        if (namesArray[0] > 1) {
            textField.setAttribute("value", "Item " + 1);
            namesArray.push(1);
        } else {
            let detected = false;
            for (var i = 0; i < namesArray.length; i++) {
                if ((namesArray[i + 1] - namesArray[i]) > 1 && namesArray[i + 1] != namesArray[i]) {
                    textField.setAttribute("value", "Item " + (namesArray[i] + 1));
                    namesArray.push(namesArray[i] + 1);
                    detected = true;
                    break;
                }
            }
            if (detected == false) {
                textField.setAttribute("value", "Item " + (namesArray[namesArray.length - 1] + 1));
                namesArray.push((namesArray[namesArray.length - 1] + 1));
            }
        }
    }
}

function deleteItem(id) {
    let deleteItemDiv = document.getElementById("item" + id);

    //удаление названия элемента из массива названий
    let itemName = deleteItemDiv.querySelector("input.textfield_added_elem").value;
    let itemNameArr = itemName.split(" ");
    let indexNameItem = namesArray.indexOf(parseInt(itemNameArr[1]));
    if (itemNameArr[0] == "Item") {
        namesArray.splice(indexNameItem, 1);
    }

    rects.splice(id, 1);
    addedElemsContainer.removeChild(deleteItemDiv);

    var index = 0;
    //переопределение id
    let node = addedElemsContainer.firstChild;
    if (node !== null) {
        redefinitionId(node, index);
        while ((node = node.nextSibling) !== null) {
            index++;
            redefinitionId(node, index);
        }
        count = ++index;
    } else {
        strokeRect = false;
        clearContainer();
    }
}

//поиск объекта
function searchItem() {
    let searchValue = document.getElementById("searchItem").value;
    let reg = new RegExp("^" + searchValue);
    let item = addedElemsContainer.firstChild;
    if (item != null) {
        do {
            if (reg.test(item.querySelector("input.textfield_added_elem").value))
                item.setAttribute("class", "added_elem");
            else
                item.setAttribute("class", "added_elem hidden");
        } while ((item = item.nextSibling) != null)
    }
}

//переопределение id
function redefinitionId(node, index) {
    node.setAttribute("id", "item" + index);
    node.onmouseover = () => { strokeRect = rects[index]; }

    node.firstChild.setAttribute("onclick", "deleteItem(" + index + ")");
    node.lastChild.setAttribute("onclick", "addParams(" + index + ")");
}

function addParams(id) {
    var item = document.getElementById("item" + id);

    if (item.querySelector("div.params_box")) {
        let findParamsBox = item.lastChild;
        item.removeChild(findParamsBox);
        findParamsBox = item.lastChild;
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
        labelX.innerText = "Коорд. X: ";
        let textFieldX = document.createElement("input");
        textFieldX.setAttribute("class", "text_field_params_box");
        textFieldX.setAttribute("value", rects[id].x);
        textFieldX.setAttribute("id", "inputx" + id);
        textFieldX.setAttribute("oninput", "inputX(" + id + ")");
        labelAndInputX.appendChild(labelX);
        labelAndInputX.appendChild(textFieldX);

        let labelAndInputY = document.createElement("div");
        let labelY = document.createElement("label");
        labelY.innerText = "Коорд. Y: ";
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
        labelW.innerText = "Ширина (мм): ";
        let textFieldW = document.createElement("input");
        textFieldW.setAttribute("class", "text_field_params_box");
        textFieldW.setAttribute("value", rects[id].w);
        textFieldW.setAttribute("id", "inputw" + id);
        textFieldW.setAttribute("oninput", "inputW(" + id + ")");
        labelAndInputW.appendChild(labelW);
        labelAndInputW.appendChild(textFieldW);

        let labelAndInputH = document.createElement("div");
        let labelH = document.createElement("label");
        labelH.innerText = "Длина (мм): ";
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

        let sliderBox = document.createElement("div");
        sliderBox.setAttribute("class", "slider_box");
        let sliderLabel = document.createElement("label");
        sliderLabel.innerText = "Угол поворота: ";
        let sliderDiv = document.createElement("div");
        sliderDiv.setAttribute("style", "display: flex; align-items: center;");
        let minValue = document.createElement("label");
        minValue.innerText = 0;
        let slider = document.createElement("input");
        slider.setAttribute("type", "range");
        slider.setAttribute("min", "0");
        slider.setAttribute("max", "360");
        slider.setAttribute("step", "1");
        slider.setAttribute("id", "slider" + id);
        slider.setAttribute("value", rects[id].angle);
        slider.setAttribute("oninput", "rotate(" + id + ")");
        let maxValue = document.createElement("label");
        maxValue.innerText = 360;
        let sliderValue = document.createElement("input");
        sliderValue.setAttribute("id", "sliderValue" + id);
        sliderValue.setAttribute("class", "slider_value");
        sliderValue.setAttribute("oninput", "rotateValue(" + id + ")");
        sliderValue.value = rects[id].angle;

        sliderDiv.appendChild(minValue);
        sliderDiv.appendChild(slider);
        sliderDiv.appendChild(maxValue);

        sliderBox.appendChild(sliderLabel);
        sliderBox.appendChild(sliderDiv);
        sliderBox.appendChild(sliderValue);
        item.appendChild(sliderBox);


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

//ползунок поворота
function rotate(id) {
    let slider = document.getElementById("slider" + id);
    let sliderValue = document.getElementById("sliderValue" + id);
    rects[id].angle = slider.value;
    sliderValue.value = slider.value;
}

//поле для ввода угла поворота
function rotateValue(id) {
    let slider = document.getElementById("slider" + id);
    let sliderValue = document.getElementById("sliderValue" + id);
    rects[id].angle = sliderValue.value;
    slider.value = sliderValue.value;
}

function clearContainer() {
    rects.splice(0);
    namesArray.splice(0);
    while (addedElemsContainer.firstChild != null) {
        let elem = addedElemsContainer.firstChild;
        addedElemsContainer.removeChild(elem);
    }
    count = 0;
}

var isCursorInRect = (rect) => {
    let rectRight = rect.x + rect.w;
    let rectBottom = rect.y + rect.h;

    //курсор resize
    if (mouse.x - rect.x < 20 && mouse.y - rect.y > 20 && (rectBottom - mouse.y) > 20 && mouse.x - rect.x > 0)
        canvas.style.cursor = "w-resize";
    if (mouse.y - rect.y < 20 && mouse.x - rect.x < 20 && mouse.x - rect.x > 0 && mouse.y - rect.y > 0)
        canvas.style.cursor = "nw-resize";
    if (mouse.y - rect.y < 20 && mouse.x - rect.x > 20 && (rectRight - mouse.x) > 20 && mouse.y - rect.y > 0)
        canvas.style.cursor = "n-resize";
    if (mouse.y - rect.y < 20 && rectRight - mouse.x < 20 && rectRight - mouse.x > 0 && mouse.y - rect.y > 0)
        canvas.style.cursor = "ne-resize";
    if (rectRight - mouse.x < 20 && mouse.y - rect.y > 20 && (rectBottom - mouse.y) > 20 && rectRight - mouse.x > 0)
        canvas.style.cursor = "e-resize";
    if (rectBottom - mouse.y < 20 && rectRight - mouse.x < 20 && rectRight - mouse.x > 0 && rectBottom - mouse.y > 0)
        canvas.style.cursor = "se-resize";
    if (rectBottom - mouse.y < 20 && mouse.x - rect.x > 20 && (rectRight - mouse.x) > 20 && rectBottom - mouse.y > 0)
        canvas.style.cursor = "s-resize";
    if (rectBottom - mouse.y < 20 && mouse.x - rect.x < 20 && mouse.x - rect.x > 0 && rectBottom - mouse.y > 0)
        canvas.style.cursor = "sw-resize";

    //курсор move
    if ((mouse.x - rect.x > 20) && (mouse.y - rect.y > 20) && ((rectRight - mouse.x) > 20) &&
        ((rectBottom - mouse.y) > 20)) {
        canvas.style.cursor = "move";
    }


    return (mouse.x > rect.x) && (mouse.x < rectRight) && (mouse.y > rect.y) && (mouse.y < rectBottom);
}

//перенос начала системы координат в центр canvasa'а
context.translate(canvas.offsetWidth / 2, canvas.offsetHeight / 2);
//изначальные размеры комнаты
var wallWidth = 5000, wallHeight = 2500;

//ввод ширины
function inputRoomW() {
    let inputW = document.getElementById("input_room_w");
    wallWidth = inputW.value;
}

function inputRoomH() {
    let inputH = document.getElementById("input_room_h");
    wallHeight = inputH.value;
}

//комната
function drawRoom() {
    //context.beginPath();
    //context.moveTo(-wallWidth / 2, wallHeight / 2 - 300);
    //context.lineTo(-wallWidth / 2, -wallHeight / 2);
    //context.lineTo(wallWidth / 2, -wallHeight / 2);
    //context.lineTo(wallWidth / 2, wallHeight / 2);
    //context.lineTo(-wallWidth / 2, wallHeight / 2);
    //context.lineTo(-wallWidth / 2, wallHeight / 2 - 100);

    context.strokeStyle = '#929292';
    context.lineWidth = 100;
    context.fillStyle = '#CAE0E4';
    context.strokeRect(-wallWidth / 2 - camera.x, -wallHeight / 2 - camera.y, wallWidth, wallHeight);
    context.fillRect(-wallWidth / 2 - camera.x, -wallHeight / 2 - camera.y, wallWidth, wallHeight);
    context.stroke();
}

//коэффициент увеличения масштаба
context.scale(0.2, 0.2);
var scale = 0.2;

//ф-я изменения масштаба
function zoom(event) {
    if (event.deltaY == -100) {
        context.scale(1.1, 1.1);
        scale *= 1.1;
    }
    if (event.deltaY == 100) {
        context.scale(0.9, 0.9);
        scale *= 0.9;
    }
}

function zoomPlusMinus(value) {
    if (value == "plus") {
        context.scale(1.1, 1.1);
        scale *= 1.1;
    }
    if (value == "minus") {
        context.scale(0.9, 0.9);
        scale *= 0.9;
    }
}

setInterval(() => {
    context.clearRect(-10000, -10000, 20000, 20000);
    canvas.style.cursor = "default";

    //комната
    drawRoom();

    //сброс названия
    let itemName = document.getElementById("itemName");
    itemName.innerText = "";

    for (i in rects) {
        rects[i].contextSet();

        rects[i].draw();

        let item = document.getElementById("item" + i);
        //сброс фона добавленного элемента
        item.setAttribute("style", "");

        if (isCursorInRect(rects[i])) {
            context.strokeStyle = '#001EFF';
            context.lineWidth = 5;
            //отрисовка синих границ объекта
            rects[i].stroke();
            //название объекта
            itemName.innerText = item.querySelector("input.textfield_added_elem").value;

            //установка фона выбранного добавленного элемента
            item.setAttribute("style", "background-color: rgb(219, 226, 226);");
        }

        rects[i].contextUnset();
    }

    //отрисовка синих границ объекта, если навелись на item
    if (strokeRect != false) {
        strokeRect.contextSet();
        context.strokeStyle = '#001EFF';
        context.lineWidth = 5;
        strokeRect.stroke();
        strokeRect.contextUnset();
    }

    //перемещение объекта
    if (selected && (mouse.x - selected.x > 20) && (mouse.y - selected.y > 20) && (((selected.x + selected.w) - mouse.x) > 20) &&
        (((selected.y + selected.h) - mouse.y) > 20)) {
        if ((mouse.x + selected.w / 2) < wallWidth && (mouse.x - selected.w / 2) > -wallWidth) {
            selected.x = mouse.x - selected.w / 2;
        }
        if ((mouse.y + selected.h / 2) < wallHeight && (mouse.y - selected.h / 2) > -wallHeight) {
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
    mouse.x = (e.pageX - addedElems.offsetWidth - canvas.offsetWidth / 2) / scale + camera.x;
    mouse.y = (e.pageY - Header.offsetHeight - canvas.offsetHeight / 2) / scale + camera.y;

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
        if (mouse.x - selected.x < 20) {
            changeSizeXLeft = true;
        }
        if ((selected.x + selected.w) - mouse.x < 20) {
            changeSizeXRight = true;
        }
        if (mouse.y - selected.y < 20) {
            changeSizeYTop = true;
        }
        if (((selected.y + selected.h) - mouse.y) < 20) {
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

//перемещение камеры
addEventListener("keydown", moveCamera);
function moveCamera(e) {
    switch (e.keyCode) {
        case 37:  // если нажата клавиша влево
            camera.move(-1000,0);
            break;
        case 38:   // если нажата клавиша вверх
            camera.move(0, -1000);
            break;
        case 39:   // если нажата клавиша вправо
            camera.move(1000, 0);
            break;
        case 40:   // если нажата клавиша вниз
            camera.move(0, 1000);
            break;
    }
}
