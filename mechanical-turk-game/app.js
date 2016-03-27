//Variables that can be configured
var rows = 7;
var columns = 6;
var rows_to_show = 6 ; 
var cell_size = 50; // in pixels
var speed_of_game = 1000 ; // Time for each grid update cycle 
var form_selector = "#mturk_form";

var board = [
    [0, 0, 0, 1, 0, 0], //0
    [0, 0, 0, 0, 1, 1], //1
    [0, 0, 0, 0, 0, 0], //2
    [0, 0, 0, 0, 0, 0], //3
    [1, 1, 1, 0, 0, 0], //4
    [0, 0, 0, 0, 0, 0], //5
    [0, 0, 0, 0, 0, 0] //6
];


var top_row = 4 ;
var ship_location = 0;

var gameboard;
var player ;
var counter ;
var reward = 0 ;

$(document).ready(function() {
    create_board();
    create_grids();
    create_counter() ;
    create_player();
})

$("#start").click(function(e){
    $(document).keydown(function(e) {
        if (e.keyCode == 37) { // left arrow clicked
            move_player_left() ;
        } else if (e.keyCode == 39) { // right arrow clicked
            move_player_right() ;
        }
    });

    setInterval(update_grid, speed_of_game) ;
});

function create_board() {
    gameboard = $("<div id='gameboard'></div>");
    gameboard.width(columns * cell_size);
    gameboard.height(rows_to_show * cell_size);

    $(document.body).append(gameboard);
}

/* create_grids()
 * Create the cell grids for the gameboard
 */
function create_grids() {
    for (var i = 0; i < rows_to_show; i++) {
        var row = board[i];

        for (var j = 0; j < columns; j++) {
            var cell_name = 'gamecell_r' + i + '_c' + j;
            var cell = $("<div id='" + cell_name + "'></div>");
            cell.width(cell_size);
            cell.height(cell_size);
            cell.css("position", "absolute");
            cell.css("top", i * cell_size); //set the row for the cell
            cell.css("left", j * cell_size); //set the height for the cell

            gameboard.append(cell);
        }
    }
}

function create_counter() {
    counter = $("<div class='counter'>$ <span id='reward'>0.00<span></div>");
    $('body').append(counter) ;
    counter = $('#reward') ;
}

function create_player() {
    player = $("<div class='player'></div>");
    player.css("width", cell_size+"px") ;
    player.css("height", cell_size+"px") ;
    player.css("top", (rows_to_show-1)*cell_size) ;
    player.css("left", 0) ;
    $(gameboard).append(player);
}

/* update_grid()
 * Update a grid using an offset based a counter
 */
function update_grid() {

    for(var i = 0 ; i < rows ; i++) {

        for(var j = 0 ; j < columns ; j++) {
            var cell_name = 'gamecell_r' + i + '_c' + j;
            var cell = $('#'+cell_name) ;

            var state = board[Math.abs(((i+top_row)%rows))][j] ;
            cell.css("background-color", 'none') ;
            if(state == 1) {
                cell.css("background-color", 'blue') ;
            }
        }
    }

    //Update counter to reflect what should be the top row in the next round
    if(top_row == 0) {
        top_row = rows_to_show ;
    }
    else {
        top_row = top_row - 1 ;
    }

    check_rewards() ;
    check_if_won_or_lost() ;

}

function move_player_left() {
    var position = parseInt(player.css("left")) ;
    var move ;

    if(position == 0) {
        move = cell_size*(columns-1) ;
    }
    else {
        move = position-cell_size ;
    }

    player.css("left", move+"px") ;
}

function move_player_right() {
    var position = parseInt(player.css("left")) ;
    var move ;

    if(position == cell_size*(columns-1)) {
        move = 0 ;
    }
    else {
        move = position+cell_size ;
    }
   
    player.css("left", move+"px") ;
}

var original_second = Math.floor((new Date().getTime() / 1000.0)) ;
var prev_second = original_second ;

function check_rewards() {
    var milliseconds = new Date().getTime();
    var current_second = Math.floor((milliseconds / 1000.0)) ;
    reward = Number($('#reward').text()) ;

    if(prev_second != current_second) {
        reward = reward + 0.001 ;
        counter.text(reward.toFixed(3)) ;
    }

    prev_second = current_second ;
}

function check_if_won_or_lost() {
    //Elapsed time
    var current_second = Math.floor(new Date().getTime() / 1000.0) ;
    var time = current_second - original_second ;

    //Winning condition
    if(reward == 2) {
        alert("You won! The HIT will be submitted.") ;
        $("<input type='hidden' name='elapsedTime' value='" + time + "'>").appendTo($(form_selector));
        $("<input type='hidden' name='reward' value='" + reward + "'>").appendTo($(form_selector));
        $( form_selector ).submit();
    }
    //Losing condition
    else {
        var position = parseInt(player.css("left")) ;
        position = position / cell_size ;

        var state = board[(top_row+(rows_to_show))%rows][position] ;
        if(state == 1) {
             alert ("You lost! The HIT will be submitted.") ;
             $( form_selector ).submit();
        }

        


    }
}



