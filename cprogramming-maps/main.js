var tags = [];

//A tag object
function Tag(text, comment, x, y) {
    this.text = text;
    this.comment = comment;
    this.x = x;
    this.y = y;
}

// wait for our page to load
$(document).ready(function() {

    // initialize the canvas
    var canvas = document.getElementById('canvas') ;
    var ctx = canvas.getContext('2d');

    // get the size of our canvas
    var orig_canvas_width = canvas.width;
    var orig_canvas_height = canvas.height;

    var canvasPos = { "deltaX": 0, "deltaY": 0 };

    var initialImageWidth = 500;
    var newImageHeight = 0;

    var image_height, image_width;

    //For the zooming
	var currentScale = 1;
    var currentX = 0;
    var currentY = 0;

    //For the tags
    ctx.font = "20px Arial";
    var currentTagX; //X of clicked position for a tag
    var currentTagY; //Y of clicked position for a tag
    var boxtagwidth = 10; // Size of box to draw

    //Load the image
    var img;
    img = new Image();
    img.onload = function() {
        //image is done loading, now we can paint it to the canvas
       	//0, 0 represents the x,y of the upper left corner where we place the image
        //canvas_width, canvas_height represents how large we want to display the image

        image_height = img.height;
        image_width = img.width;
        newImageHeight = image_height / image_width * initialImageWidth;

        //Draw the image on the canvas for the first time
        ctx.clearRect(0, 0, orig_canvas_width, orig_canvas_height);
        ctx.drawImage(img, 0, 0, initialImageWidth, newImageHeight);
    }

    img.src = "map.png";

    // our event object that handled clicking (mousedown), mousemove (dragging), mouseup (enddragging)
    var events = {

        dragging: false,
        mouseX: 0,
        mouseY: 0,
        mouseDown: function(e) {
        	console.log("\n\nON A MOUSE DOWN")
            //Redraw canvas on each click
            ctx.clearRect(0, 0, orig_canvas_width, orig_canvas_height);
            canvasPos.deltaX = currentX;
            canvasPos.deltaY = currentY;
            ctx.drawImage(img, canvasPos.deltaX, canvasPos.deltaY, initialImageWidth, newImageHeight);
            drawTagsMove(canvasPos.deltaX, canvasPos.deltaY) ;
            //End of redraw canvas

            // get the current mouse position (DRAGSTART)
            var r = canvas.getBoundingClientRect();
            console.log("mouse is at left: " + r.left + " and - r.top: " + r.top) ;
            console.log("clientX: " + e.clientX + " and - clientY: " + e.clientY) ;
            console.log("canvas pos X: " + canvasPos.deltaX + " canvas pos Y: " + canvasPos.deltaY) ;
            console.log('\n\n') ;

            var x = (e.clientX - r.left) * currentScale;
            var y = (e.clientY - r.top) * currentScale;

            console.log("CurX: " + currentX + " - CurY: " + currentY);
            console.log("Current scale " + currentScale + " \nX: " + x + " AND Y: " + y);
            ctx.fillRect(x, y, boxtagwidth, boxtagwidth);
            currentTagX = x - currentX;
            currentTagY = y - currentY;
            console.log("CurTagX: " + currentTagX + " - CurTagY: " + currentTagY);

            events.dragging = true;

        },

        mouseMove: function(e) {
            if (events.dragging) {
            	console.log("\n\nON A MOUSE MOVE")
                // get the current mouse position (updates every time the mouse is moved durring dragging)
                var r = canvas.getBoundingClientRect();
                var x = (e.clientX - r.left) * currentScale;
                var y = (e.clientY - r.top) * currentScale;
                console.log("X: " + x + " - Y: " + y) ;

                // calculate how far we moved
                canvasPos.deltaX = (x - events.mouseX); // total distance in x
                canvasPos.deltaY = (y - events.mouseY); // total distance in y

                canvasPos.deltaX = canvasPos.deltaX-currentTagX ;
                canvasPos.deltaY = canvasPos.deltaY-currentTagY ;
                
                currentX = canvasPos.deltaX;
                currentY = canvasPos.deltaY;

                // we need to clear the canvas, otherwise we'll have a bunch of overlapping images
                ctx.clearRect(0, 0, orig_canvas_width, orig_canvas_height);

                // these will be our new x,y position to move the image. Redraw the canvas!
                ctx.drawImage(img, canvasPos.deltaX, canvasPos.deltaY, initialImageWidth, newImageHeight);
                drawTagsMove(canvasPos.deltaX, canvasPos.deltaY) ;
            }
        },

        mouseUp: function(e) {
            events.dragging = false;
        }
    }

    $("#zoomIn").click(function() {
    	//Redraw canvas!
        ctx.clearRect(0, 0, orig_canvas_width, orig_canvas_height);
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0, initialImageWidth, newImageHeight);
        drawTags() ;
        //End of redraw

        // Inverse of the scale since now canvas occupies less space
        orig_canvas_width = orig_canvas_width / 2; 
        orig_canvas_height = orig_canvas_height / 2;

        currentScale = currentScale / 2;
        console.log("Current scale: " + currentScale);

        currentX = 0;
        currentY = 0;
    });

    $("#zoomOut").click(function() {
    	//Redraw canvas!
        ctx.clearRect(0, 0, orig_canvas_width, orig_canvas_height);
        ctx.scale(0.5, 0.5);
        ctx.drawImage(img, 0, 0, initialImageWidth, newImageHeight);
        drawTags() ;
        //End of redraw

        orig_canvas_width = orig_canvas_width * 2;
        orig_canvas_height = orig_canvas_height * 2;

        currentScale = currentScale * 2;
        console.log("Current scale: " + currentScale);

        currentX = 0;
        currentY = 0;
    });

    function drawTags() {
        for (var i = 0; i < tags.length; i++) {
            ctx.fillRect(tags[i].x, tags[i].y,boxtagwidth,boxtagwidth);
            ctx.fillText(tags[i].text, tags[i].x, tags[i].y);
        }

    }

    function drawTagsMove(canvasx, canvasy) {
        for (var i = 0; i < tags.length; i++) {
            ctx.fillRect(tags[i].x+canvasx, tags[i].y+canvasy,boxtagwidth,boxtagwidth);
            ctx.fillText(tags[i].text, tags[i].x+canvasx, tags[i].y+canvasy);
        }

    }

    canvas.addEventListener('mousedown', events.mouseDown, false);
    canvas.addEventListener('mousemove', events.mouseMove, false);
    canvas.addEventListener('mouseup', events.mouseUp, false);


    $("#submitbutton").click(function() {
        // console.log(currentTagX);
        // console.log(currentTagY);
        var name = $('#streetname').val();
        var comment = $('#comments').val();
        ctx.fillText(name, currentTagX+currentX, currentTagY+currentY);
        console.log("PLACING TEXT AT: " + (currentTagX+currentX) + " AND " + (currentTagY+currentY)) ;

        //Creating a new tag whose location is based off of the origin of the picture
        var newtag = new Tag(name, comment, currentTagX, currentTagY); 
        tags.push(newtag); //Pushing it into our tag array
        console.log(tags) ;
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
});