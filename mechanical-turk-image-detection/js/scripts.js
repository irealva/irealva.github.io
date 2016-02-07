$("#draw").addClass('active');

$('body').on('click', '.btn-group button', function (e) {
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
    
    //do any other button related things
});


// Empty JS for your own code to be here

var canvas = document.getElementById("canvas1");
var context = canvas.getContext("2d");
//context.globalCompositeOperation = "source-over";
//context.globalCompositeOperation = "destination-out";
//context.globalCompositeOperation = "destination-over";

var width = 20 ;
var height = 20 ;

var j = 0 ;

var boxes = []; 

function Box() {
  this.x = 0;
  this.y = 0;
}

 function draw(e) {
    var pos = getMousePos(canvas, e);
    posx = pos.x;
    posy = pos.y;
    
    
    if ($("#draw").hasClass("active")) {
    	var rect = new Box;
		rect.x = posx;
		rect.y = posy;
		boxes.push(rect);

		context.fillStyle="#FF0000";
		context.fillRect(rect.x,rect.y,width,height);
    	j++
    	$( "#counted" ).html( j );
    }
    else {
    	
    	for (var i = 0; i < boxes.length; i++) {
    		if( (posx > boxes[i].x) && (posx < boxes[i].x + width) && (posy > boxes[i].y) && (posy < boxes[i].y + height)) {
    			//context.strokeStyle = "rgba(0,0,0,1)";
    			context.clearRect(boxes[i].x, boxes[i].y, width, height);
    			boxes.splice(i, 1) ; // at position i remove 1 

    			//var str = $( "#counted" ).text();
    			j-- ;
				$( "#counted" ).html( j );

    		}
		}
    }
}

function eraseAll() {
	for (var i = 0; i < boxes.length; i++) {
    	context.clearRect(boxes[i].x, boxes[i].y, width, height);
	}
	boxes = []; 
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}
