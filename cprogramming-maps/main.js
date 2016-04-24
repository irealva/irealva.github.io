// wait for our page to load
$(document).ready(function () {

	// initialize our canvas
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d');

	var log = document.getElementById('log');

	var orig_canvas_width = canvas.width ;
	var orig_canvas_height = canvas.height ;

	// get the size of our canvas
	var canvas_width = canvas.width,
		canvas_height = canvas.height;

	var canvasPos = {"deltaX": 0, "deltaY": 0};

	var initialImageWidth = 500;
	var newImageHeight = 0;

	var image_height, image_width;

	ctx.font = "20px Arial";
	var f1x = 80 ;
	var f1y = 200 ;
	var currentTagX ;
	var currentTagY ;

	var currentScale = 1 ;
	var currentX = 0 ; 
	var currentY = 0 ;

	// load our large image
	var img;
	img = new Image();
	img.onload = function() {

		/*
		# image is done loading, now we can paint it to the canvas

		1) 0, 0 represents the x,y of the upper left corner where we place the image

		2) canvas_width, canvas_height represents how large we want to display the image

		3) The image might have a different scaling than the canvas so we might see
		   the image stretch or shrink.

		4) let's calculate how to correctly display the image using the aspect ratio to fit
		   a pre-defined width (500px);
		*/

		image_height = img.height;
		image_width = img.width;
		newImageHeight = image_height / image_width * initialImageWidth;

		ctx.clearRect(0,0, orig_canvas_width, orig_canvas_height);
		ctx.drawImage(img, 0, 0, initialImageWidth, newImageHeight);
		ctx.fillText("Hello World",f1x,f1y);
		ctx.fillRect(f1x,f1y, 6, 6) ;
	}
	img.src = "image.jpg";

	// our event object that handled clicking (mousedown), mousemove (dragging), mouseup (enddragging)
	var events = {

		dragging: false,
		mouseX: 0,
		mouseY: 0,
		mouseDown: function(e)
		{	
			//Redraw canvas!
			ctx.clearRect(0,0, orig_canvas_width, orig_canvas_height);
			canvasPos.deltaX = currentX ;
			canvasPos.deltaY = currentY ;
			ctx.drawImage(img, canvasPos.deltaX, canvasPos.deltaY, initialImageWidth, newImageHeight);
			ctx.fillText("Hello World",(f1x+canvasPos.deltaX),(f1y+canvasPos.deltaY));
			ctx.fillRect((f1x+canvasPos.deltaX),(f1y+canvasPos.deltaY), 6, 6) ;


			// get the current mouse position (DRAGSTART)
			var r = canvas.getBoundingClientRect() ;
			// console.log("mouse is at left: " + r.left + " and - r.top: " + r.top) ;
			// console.log("clientX: " + e.clientX + " and - clientY: " + e.clientY) ;
			// console.log("canvas pos X: " + canvasPos.deltaX + " canvas pos Y: " + canvasPos.deltaY) ;
			// console.log('\n\n') ;
			
			// events.mouseX = ((e.clientX - r.left)) - canvasPos.deltaX;
			// events.mouseY = ((e.clientY - r.top)) - canvasPos.deltaY;

			log.innerHTML += 'User clicked at: ' + events.mouseX + ", " + events.mouseY + '! <br/>';

			var x = (e.clientX - r.left) *currentScale ;
			var y = (e.clientY - r.top) * currentScale ;


			console.log("Current scale " + currentScale + " \nX: " + x + " AND Y: " + y) ;
			ctx.fillRect(x, y, 30,30) ;
			currentTagX = x ;
			currentTagY = y ;

			log.scrollTop = log.scrollHeight;
			events.dragging = true;

		},
		
		mouseMove: function(e)
		{
			if (events.dragging)
			{	
				// get the current mouse position (updates every time the mouse is moved durring dragging)
				var r = canvas.getBoundingClientRect();
		        var x = (e.clientX - r.left) * currentScale;
		        var y = (e.clientY - r.top) * currentScale;

		        // calculate how far we moved
		        canvasPos.deltaX = (x - events.mouseX ) ; // total distance in x
				canvasPos.deltaY = (y - events.mouseY ) ; // total distance in y
				currentX = canvasPos.deltaX ;
				currentY = canvasPos.deltaY ;
				console.log("CurPosX: " + currentX + " - CurPosY: " + currentY) ;

				// we need to clear the canvas, otherwise we'll have a bunch of overlapping images
				ctx.clearRect(0,0, orig_canvas_width, orig_canvas_height);
				
				// these will be our new x,y position to move the image.
				ctx.drawImage(img,  canvasPos.deltaX, canvasPos.deltaY, initialImageWidth, newImageHeight);
				ctx.fillText("Hello World",(f1x+canvasPos.deltaX),(f1y+canvasPos.deltaY));
				ctx.fillRect((f1x+canvasPos.deltaX),(f1y+canvasPos.deltaY), 6, 6) ;

				log.innerHTML += 'User is dragging to: ' + x + ", " + y + ' <br/>';
				log.scrollTop = log.scrollHeight;
			}
		},

		mouseUp: function (e) {
			log.innerHTML += 'User let go and moved a total of: ' + canvasPos.deltaX + ", " + canvasPos.deltaY + ' <br/>';

			events.dragging = false;
			log.scrollTop = log.scrollHeight;

		}
	}

	$("#zoomIn").click(function () {

		ctx.clearRect(0,0, orig_canvas_width, orig_canvas_height);
		ctx.scale(2,2) ;
		ctx.drawImage(img, 0, 0, initialImageWidth, newImageHeight);
		ctx.fillText("Hello World",f1x,f1y);

		orig_canvas_width = orig_canvas_width / 2 ; // Inverse of the scale since now canvas occupies less space
		orig_canvas_height = orig_canvas_height / 2 ;

		currentScale = currentScale / 2;
		console.log("Current scale: " + currentScale) ;

		currentX = 0 ;
		currentY = 0 ;

		// canvasPos.deltaX = 0;
		// canvasPos.deltaY = 0;
		
		/*
		// for simplicity we use a x2 scaling and calculate new sizes (like above)
		initialImageWidth = initialImageWidth * 2;
		newImageHeight = image_height / image_width * initialImageWidth;

		ctx.clearRect(0,0, canvas_width, canvas_height);
		ctx.drawImage(img, 0, 0, initialImageWidth, newImageHeight);
		f1x = f1x * 2 ;
		f1y = f1y * 2 ;
		ctx.fillText("Hello World",f1x,f1y);
		ctx.fillRect(f1x, f1y, 6, 6) ;

		// we need to reset any dragging movements we set
		canvasPos.deltaX = 0;
		canvasPos.deltaY = 0;
		*/
		
	});

	$("#zoomOut").click(function () {
		ctx.clearRect(0,0, orig_canvas_width, orig_canvas_height);
		ctx.scale(0.5,0.5) ;
		ctx.drawImage(img, 0, 0, initialImageWidth, newImageHeight);
		ctx.fillText("Hello World",f1x,f1y);

		orig_canvas_width = orig_canvas_width * 2 ;
		orig_canvas_height = orig_canvas_height * 2 ;

		currentScale = currentScale * 2 ;
		console.log("Current scale: " + currentScale) ;

		currentX = 0 ;
		currentY = 0 ;

		// canvasPos.deltaX = 0;
		// canvasPos.deltaY = 0;

		/*
		// for simplicity we use a x2 scaling and calculate new sizes (like above)
		initialImageWidth = initialImageWidth / 2;
		newImageHeight = image_height / image_width * initialImageWidth;

		f1x = f1x / 2 ;
		f1y = f1y / 2 ;

		ctx.clearRect(0,0, canvas_width, canvas_height);
		ctx.drawImage(img, 0, 0, initialImageWidth, newImageHeight);
		ctx.fillText("Hello World",f1x,f1y);
		ctx.fillRect(f1x, f1y, 6, 6) ;

		// we need to reset any dragging movements we set
		canvasPos.deltaX = 0;
		canvasPos.deltaY = 0;
		*/
		

	});

	//IN case we use form prevent default behavior which is to submit a window
	/*
	$("#submitbutton").submit(function(e) {
	    e.preventDefault();
	    console.log(currentTagX) ;
		console.log(currentTagY) ;
		var name = $('#comments') ;
		console.log(name.val()) ;
		console.log(name.text) ;
	});
	*/

	$("#submitbutton").click(function() {
	    console.log(currentTagX) ;
		console.log(currentTagY) ;
		var name = $('#streetname') ;
		console.log(name.val()) ;
		ctx.fillText(name.val(),currentTagX,currentTagY);
	});

	// $('#submitbutton').click(function(){ 


	// 	console.log(currentTagX) ;
	// 	console.log(currentTagY) ;

	// 	var name = $('#streetname') ;
	// 	console.log(name.value) ;


	// });

	canvas.addEventListener('mousedown', events.mouseDown, false);
	canvas.addEventListener('mousemove', events.mouseMove, false);
	canvas.addEventListener('mouseup', events.mouseUp, false);

});


