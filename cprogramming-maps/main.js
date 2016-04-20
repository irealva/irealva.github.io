// wait for our page to load
$(document).ready(function () {

	// initialize our canvas
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d');

	var log = document.getElementById('log');

	// get the size of our canvas
	var canvas_width = canvas.width,
		canvas_height = canvas.height;

	var canvas_center_x = canvas_width / 2;
	var canvas_center_y = canvas_height / 2;

	var canvasPos = {"deltaX": 0, "deltaY": 0};

	var initialImageWidth = 500;
	var newImageHeight = 0;

	var image_height, image_width;



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

		ctx.drawImage(img, 0, 0, initialImageWidth, newImageHeight);
	}
	img.src = "image.jpg";


	// our event object that handled clicking (mousedown), mousemove (dragging), mouseup (enddragging)
	var events = {

		dragging: false,
		mouseX: 0,
		mouseY: 0,
		mouseDown: function(e)
		{	

			// get the current mouse position (DRAGSTART)
			var r = canvas.getBoundingClientRect();
			events.mouseX = (e.clientX - r.left) - canvasPos.deltaX;
			events.mouseY = (e.clientY - r.top) - canvasPos.deltaY;

			log.innerHTML += 'User clicked at: ' + events.mouseX + ", " + events.mouseY + '! <br/>';
			log.scrollTop = log.scrollHeight;
			events.dragging = true;

		},
		
		mouseMove: function(e)
		{
			if (events.dragging)
			{	
				// get the current mouse position (updates every time the mouse is moved durring dragging)
				var r = canvas.getBoundingClientRect();
		        var x = e.clientX - r.left;
		        var y = e.clientY - r.top;

		        // calculate how far we moved
		        canvasPos.deltaX = (x - events.mouseX); // total distance in x
				canvasPos.deltaY = (y - events.mouseY); // total distance in y

				// we need to clear the canvas, otherwise we'll have a bunch of overlapping images
				ctx.clearRect(0,0, canvas_width, canvas_height);

				// these will be our new x,y position to move the image.
				ctx.drawImage(img,  canvasPos.deltaX, canvasPos.deltaY, initialImageWidth, newImageHeight);

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
		
		// for simplicity we use a x2 scaling and calculate new sizes (like above)
		initialImageWidth = initialImageWidth * 2;
		newImageHeight = image_height / image_width * initialImageWidth;

		// center of the image currently
		var image_center_x = initialImageWidth / 2;
		var image_center_y = newImageHeight / 2;

		// subtract the cavas size by the image center, that's how far we need to move it.
		var imageXPos = canvas_center_x - image_center_x;
		var imageYPos = canvas_center_y - image_center_y;


		ctx.clearRect(0,0, canvas_width, canvas_height);
		ctx.drawImage(img, imageXPos, imageYPos, initialImageWidth, newImageHeight);

		// since we dynamically moved the image to the center of the image, 
		// we need to set our deltas so panning uses this new point
		canvasPos.deltaX = imageXPos;
		canvasPos.deltaY = imageYPos;

	});

	$("#zoomOut").click(function () {

		// for simplicity we use a x2 scaling and calculate new sizes (like above)
		initialImageWidth = initialImageWidth / 2;
		newImageHeight = image_height / image_width * initialImageWidth;

		// center of the image currently
		var image_center_x = initialImageWidth / 2;
		var image_center_y = newImageHeight / 2;

		// subtract the cavas size by the image center, that's how far we need to move it.
		var imageXPos = canvas_center_x - image_center_x;
		var imageYPos = canvas_center_y - image_center_y;
		
		ctx.clearRect(0,0, canvas_width, canvas_height);
		ctx.drawImage(img, imageXPos, imageYPos, initialImageWidth, newImageHeight);

		// since we dynamically moved the image to the center of the image, 
		// we need to set our deltas so panning uses this new point
		canvasPos.deltaX = imageXPos;
		canvasPos.deltaY = imageYPos;
	});


	canvas.addEventListener('mousedown', events.mouseDown, false);
	canvas.addEventListener('mousemove', events.mouseMove, false);
	canvas.addEventListener('mouseup', events.mouseUp, false);

});



