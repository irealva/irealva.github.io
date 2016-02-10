$("#draw0").addClass('active');
$("#draw1").addClass('active');
$("#draw2").addClass('active');
$("#draw3").addClass('active');
$("#draw4").addClass('active');
$("#draw5").addClass('active');
$("#draw6").addClass('active');

$('body').on('click', '.btn-group button', function(e) {
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
});

var canvasArray = []
var contextArray = []

var canvas0 = document.getElementById("canvas0");
var context0 = canvas0.getContext("2d");
var canvas1 = document.getElementById("canvas1");
var context1 = canvas1.getContext("2d");
var canvas2 = document.getElementById("canvas2");
var context2 = canvas2.getContext("2d");
var canvas3 = document.getElementById("canvas3");
var context3 = canvas3.getContext("2d");
var canvas4 = document.getElementById("canvas4");
var context4 = canvas4.getContext("2d");
var canvas5 = document.getElementById("canvas5");
var context5 = canvas5.getContext("2d");
var canvas6 = document.getElementById("canvas6");
var context6 = canvas6.getContext("2d");

canvasArray.push(canvas0);
canvasArray.push(canvas1);
canvasArray.push(canvas2);
canvasArray.push(canvas3);
canvasArray.push(canvas4);
canvasArray.push(canvas5);
canvasArray.push(canvas6);
contextArray.push(context0);
contextArray.push(context1);
contextArray.push(context2);
contextArray.push(context3);
contextArray.push(context4);
contextArray.push(context5);
contextArray.push(context6);

//context.globalCompositeOperation = "source-over";
//context.globalCompositeOperation = "destination-out";
//context.globalCompositeOperation = "destination-over";

var count = [];
for (var k = 0; k < 6; k++) {
    count.push(0);
}

var boxes = [];
for (var k = 0; k < 6; k++) {
    boxes.push([]);
}

var j = 0;
var width = 8;
var height = 8;

function Box() {
    this.x = 0;
    this.y = 0;
}

function draw(e, canvasNum) {
    var pos = getMousePos(canvasArray[canvasNum], e);
    posx = pos.x;
    posy = pos.y;

    var drawString = "#draw" + canvasNum;
    if ($(drawString).hasClass("active")) {
        var rect = new Box;
        rect.x = posx;
        rect.y = posy;
        boxes[canvasNum].push(rect);

        contextArray[canvasNum].fillStyle = "#FF0000";
        contextArray[canvasNum].fillRect(rect.x, rect.y, width, height);
        count[canvasNum] = count[canvasNum] + 1;
        var countedString = "#counted" + canvasNum;
        $(countedString).html(count[canvasNum]);
    } else {

        for (var i = 0; i < boxes[canvasNum].length; i++) {
            if ((posx > boxes[canvasNum][i].x) && (posx < boxes[canvasNum][i].x + width) && (posy > boxes[canvasNum][i].y) && (posy < boxes[canvasNum][i].y + height)) {
                contextArray[canvasNum].clearRect(boxes[canvasNum][i].x, boxes[canvasNum][i].y, width, height);
                boxes[canvasNum].splice(i, 1); // at position i remove 1 

                count[canvasNum] = count[canvasNum] - 1;
                var countedString = "#counted" + canvasNum;
                $(countedString).html(count[canvasNum]);
            }
        }
    }
}

function eraseAll(canvasNum) {
    for (var i = 0; i < boxes[canvasNum].length; i++) {
        contextArray[canvasNum].clearRect(boxes[canvasNum][i].x, boxes[canvasNum][i].y, width, height);
    }
    boxes[canvasNum] = [];

    count[canvasNum] = 0;
    var countedString = "#counted" + canvasNum;
    $(countedString).html(count[canvasNum]);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
