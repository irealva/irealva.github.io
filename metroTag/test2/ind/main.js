var tags = []; // to save all the tags on the map
var mytags = [] ; //To save just tags done by one user

var counterserver = 'https://0e17c8c7.ngrok.io/counter.php' ;
var reward = 0;
var counter ; 

//A tag object
function Tag(text, comment, x, y) {
    this.text = text;
    this.comment = comment;
    this.x = x;
    this.y = y;
}

function onboard() {

    $("#onboard1").css('display', 'none');
    $("video").prop('muted', true); //mute
    $("#onboard2").css('visibility', 'visible');
}

// wait for our page to load
//$(document).ready(function() {
function startTag() {

    //remove the onboarding screens
    $("#onboard2").css('display', 'none');
    $("#intro").css('display', 'none');
    counter = $('#reward') ;

    // initialize the canvas
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // get the size of our canvas
    var orig_canvas_width = canvas.width;
    var orig_canvas_height = canvas.height;

    var canvasPos = { "deltaX": 0, "deltaY": 0 };

    var initialImageWidth = orig_canvas_width;
    var newImageHeight = 0;

    var image_height, image_width;

    //For the zooming
    var currentScale = 1;
    var currentX = 0;
    var currentY = 0;

    //For the tags
    ctx.font = "7px Avenir Next";
    var currentTagX; //X of clicked position for a tag
    var currentTagY; //Y of clicked position for a tag
    var boxtagwidth = 6; // Size of box to draw
    var textspaceheight = -6; //space between box and text
    var textspacewidth = 7;

    //For sending to server
    //var group_key = "43OfDNahmBNV" - Key for test1/group first group experiment with 20 turkers
    //var group_key= "53OfDNahmBNV" Key for test1/group failed experiment with 40 turkers
    //var group_key= "63OfDNahmBNV"

    var group_key= "20zlyYXV6" // Key for test2/ind
    var my_id = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

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

    img.src = "map.jpg";
    update_interval = setInterval(pullData, 30000);

    // our event object that handled clicking (mousedown), mousemove (dragging), mouseup (enddragging)
    var events = {

        dragging: false,
        mouseX: 0,
        mouseY: 0,
        mouseDown: function(e) {
            // console.log("\n\nON A MOUSE DOWN")
            //Redraw canvas on each click
            ctx.clearRect(0, 0, orig_canvas_width, orig_canvas_height);
            canvasPos.deltaX = currentX;
            canvasPos.deltaY = currentY;
            ctx.drawImage(img, canvasPos.deltaX, canvasPos.deltaY, initialImageWidth, newImageHeight);
            drawTagsMove(canvasPos.deltaX, canvasPos.deltaY);
            //End of redraw canvas

            // get the current mouse position (DRAGSTART)
            var r = canvas.getBoundingClientRect();
            // console.log("mouse is at left: " + r.left + " and - r.top: " + r.top);
            // console.log("clientX: " + e.clientX + " and - clientY: " + e.clientY);
            // console.log("canvas pos X: " + canvasPos.deltaX + " canvas pos Y: " + canvasPos.deltaY);
            // console.log('\n\n');

            var x = (e.clientX - r.left) * currentScale;
            var y = (e.clientY - r.top) * currentScale;

            // console.log("CurX: " + currentX + " - CurY: " + currentY);
            // console.log("Current scale " + currentScale + " \nX: " + x + " AND Y: " + y);
            ctx.fillStyle = "#f5f5f5"
            ctx.fillRect(x, y, boxtagwidth, boxtagwidth);
            currentTagX = x - currentX;
            currentTagY = y - currentY;
            // console.log("CurTagX: " + currentTagX + " - CurTagY: " + currentTagY);

            events.dragging = true;

        },

        mouseMove: function(e) {
            if (events.dragging) {
                // console.log("\n\nON A MOUSE MOVE")
                // get the current mouse position (updates every time the mouse is moved durring dragging)
                var r = canvas.getBoundingClientRect();
                var x = (e.clientX - r.left) * currentScale;
                var y = (e.clientY - r.top) * currentScale;
                //console.log("X: " + x + " - Y: " + y);

                // calculate how far we moved
                canvasPos.deltaX = (x - events.mouseX); // total distance in x
                canvasPos.deltaY = (y - events.mouseY); // total distance in y

                canvasPos.deltaX = canvasPos.deltaX - currentTagX;
                canvasPos.deltaY = canvasPos.deltaY - currentTagY;

                currentX = canvasPos.deltaX;
                currentY = canvasPos.deltaY;

                // we need to clear the canvas, otherwise we'll have a bunch of overlapping images
                ctx.clearRect(0, 0, orig_canvas_width, orig_canvas_height);

                // these will be our new x,y position to move the image. Redraw the canvas!
                ctx.drawImage(img, canvasPos.deltaX, canvasPos.deltaY, initialImageWidth, newImageHeight);
                drawTagsMove(canvasPos.deltaX, canvasPos.deltaY);
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
        drawTags();
        //End of redraw

        // Inverse of the scale since now canvas occupies less space
        orig_canvas_width = orig_canvas_width / 2;
        orig_canvas_height = orig_canvas_height / 2;

        currentScale = currentScale / 2;
        // console.log("Current scale: " + currentScale);

        currentX = 0;
        currentY = 0;
    });

    $("#zoomOut").click(function() {
        //Redraw canvas!
        ctx.clearRect(0, 0, orig_canvas_width, orig_canvas_height);
        ctx.scale(0.5, 0.5);
        ctx.drawImage(img, 0, 0, initialImageWidth, newImageHeight);
        drawTags();
        //End of redraw

        orig_canvas_width = orig_canvas_width * 2;
        orig_canvas_height = orig_canvas_height * 2;

        currentScale = currentScale * 2;
        // console.log("Current scale: " + currentScale);

        currentX = 0;
        currentY = 0;
    });

    function drawTags() {
        for (var i = 0; i < tags.length; i++) {
            ctx.fillStyle = "#f5f5f5";
            ctx.fillRect(tags[i].x, tags[i].y, boxtagwidth, boxtagwidth);
            ctx.fillText(tags[i].text, tags[i].x + textspacewidth, tags[i].y - textspaceheight);
        }

    }

    function drawTagsMove(canvasx, canvasy) {
        for (var i = 0; i < tags.length; i++) {
            ctx.fillStyle = "#f5f5f5"
            ctx.fillRect(tags[i].x + canvasx, tags[i].y + canvasy, boxtagwidth, boxtagwidth);
            ctx.fillText(tags[i].text, tags[i].x + canvasx + textspacewidth, tags[i].y + canvasy - textspaceheight);
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
        console.log(name) ;

        if(name != '') {
            ctx.fillStyle = "#f5f5f5";
            ctx.fillText(name, currentTagX + currentX + textspacewidth, currentTagY + currentY - textspaceheight);
            // console.log("PLACING TEXT AT: " + (currentTagX + currentX) + " AND " + (currentTagY + currentY));

            //Creating a new tag whose location is based off of the origin of the picture
            var newtag = new Tag(name, comment, currentTagX, currentTagY);
            tags.push(newtag); //Pushing it into our tag array
            mytags.push(newtag); //Saving to array of tags done just by single user
            // console.log(tags);

            reward = reward + 0.02 ;
            counter.text(reward.toFixed(2));

            $('#tagdata').attr("value", JSON.stringify(tags));
            $('#mytagdata').attr("value", JSON.stringify(mytags));
            $('#hitreward').attr("value", reward);

            sendTagServer(newtag);
        }

        if(reward > 2) {
            alert("You cannot tag more than this amount. Please submit your HIT") ;
        }
 
    });

    $("#submit_hit").click(function() {

        $("#ThankYouNote").fadeIn("slow");

    });

    $("#stopTagging").click(function() {

        $("#ThankYouNote").fadeIn("slow");

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

    //Pull most recent data from server
    function pullData() {
        var data = { id: my_id, all_tags: tags };

        $.ajax({
            //url: "https://codingthecrowd.com/counter.php",
            //url: "http://localhost:8000/counter.php",
            url: counterserver,

            dataType: "jsonp",
            data: {
                key: group_key,
                data: JSON.stringify(data)
            },

            success: function(response) {
                console.log(response.count);
                //console.log(response);

                process_data_pull(response);
            },
            error: function(response) {
                console.log(response);
            }
        });
    }

    //Called every second to call new refresh data from server
    function process_data_pull(response) {
        var count = response.count;
        var array = response.results;

        for (var i = 0; i < count; i++) {
            var temp = array[i];

            var data = JSON.parse(temp.data);
            var id = data.id;

            if (my_id != id) {
                compare_and_add_tags(data.all_tags);
            }
        }
    }

    //Compares data stored in server to existing tag
    //Crude comparison for now
    //Ugh, this is n^3 --> optimize?
    function compare_and_add_tags(newtags) {
        //console.log(newtags);
        var count = newtags.length;

        for (var i = 0; i < count; i++) {
            var temptag = new Tag(newtags[i].text, newtags[i].comment, newtags[i].x, newtags[i].y);
            var found = false;

            //if map has no tags, then load the new tag
            if (tags.length == 0) {
                ctx.fillStyle = "#f5f5f5";
                ctx.fillText(temptag.text, temptag.x, temptag.y);
                tags.push(temptag);
                break;
            }

            //compare new tag to whats in local version of truth
            for (var j = 0; j < tags.length; j++) {
                if (isEquivalent(temptag, tags[j])) {
                    found = true;
                    break;
                }
            }

            //if tag NOT in tag array them add
            if (found == false) {
                //console.log("adding a new tag!");
                ctx.fillStyle = "#f5f5f5";
                ctx.fillRect(temptag.x, temptag.y, boxtagwidth, boxtagwidth);
                ctx.fillText(temptag.text, temptag.x, temptag.y);
                tags.push(temptag);
            }


        }
    }

    //Function to send to server every time a new tag is added
    function sendTagServer(newtag) {
        var data = { id: my_id, all_tags: tags, new_tag: newtag };

        $.ajax({
            //url: "https://codingthecrowd.com/counter.php",
            //url: "http://localhost:8000/counter.php",
            url: counterserver,

            dataType: "jsonp",
            data: {
                key: group_key,
                data: JSON.stringify(data)
            },

            success: function(response) {
                //console.log(response);
            },
            error: function(response) {
                console.log(response);
            }
        });
    }

    /* randomString()
     * Used to create random game ID
     */
    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    function isEquivalent(a, b) {
        // console.log("\n\nCOMPARING:");
        // console.log(a);
        // console.log(b);
        // Create arrays of property names
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            // If values of same property are not equal,
            // objects are not equivalent
            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        // If we made it this far, objects
        // are considered equivalent
        return true;
    }
} //end of startTag function
//});
