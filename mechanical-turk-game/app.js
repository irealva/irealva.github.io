//Variables that can be configured
var rows = 7;
var columns = 6;
var rows_to_show = 6;
var cell_size = 50; // in pixels
var max_obstacles_per_row = 3 ;
var speed_of_game = 1000; // Time for each grid update cycle 
var form_selector = "#mturk_form";

var board = [] ;

var top_row = 4;
var ship_location = 0;

var gameboard;
var player;
var counter;
var reward = 0;
var original_second ;
var prev_second ;

//Execute when document loads
$(document).ready(function() {
    create_board();
    create_grids();
    create_counter();
    create_player();
})

//When player clicks start button, then begin the game
$("#start").click(function(e) {
    $(document).keydown(function(e) {
        if (e.keyCode == 37) { // left arrow clicked
            move_player_left();
        } else if (e.keyCode == 39) { // right arrow clicked
            move_player_right();
        }
    });

    original_second = Math.floor((new Date().getTime() / 1000.0));
    prev_second = original_second;

    setInterval(update_grid, speed_of_game);
});

/* create_board()
 * Creates the DIV for the game board
 */
function create_board() {
    //Create HTML board
    gameboard = $("<div id='gameboard'></div>");
    gameboard.width(columns * cell_size);
    gameboard.height(rows_to_show * cell_size);

    $(document.body).append(gameboard);

    //Fill the board with no state 
    for(var i = 0 ; i < rows ; i++) {
        board[i] = [] ;
        for(var j = 0 ; j < columns; j++) {
            board[i][j] = 0 ;
        }
    }

    //Create the game board randomly
    for(var i = 0 ; i < rows ; i++) {
        //Max obstacles per row
        var num_ones = Math.floor((Math.random() * max_obstacles_per_row)); 

        for(var j = 0 ; j <= num_ones ; j++) {
            var position = Math.floor((Math.random() * columns)); 
            var state = board[i][position] ;
            while(state == 1) {
                position = Math.floor((Math.random() * columns)); 
                state = board[i][position] ;
                break ;
            }

            board[i][position] = 1 ;
        }
    }

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

/* create_counter()
 * Create the counter DIV
 */
function create_counter() {
    counter = $("<div class='counter'>$ <span id='reward'>0.00<span></div>");
    $('body').append(counter);
    counter = $('#reward');
}

/* create_player()
 * Create the tile for the player
 */
function create_player() {
    player = $("<div class='player'></div>");
    player.css("width", cell_size + "px");
    player.css("height", cell_size + "px");
    player.css("top", (rows_to_show - 1) * cell_size);
    player.css("left", 0);
    $(gameboard).append(player);
}

/* update_grid()
 * Update a grid using an offset based a counter
 */
function update_grid() {

    for (var i = 0; i < rows; i++) {

        for (var j = 0; j < columns; j++) {
            var cell_name = 'gamecell_r' + i + '_c' + j;
            var cell = $('#' + cell_name);

            var state = board[Math.abs(((i + top_row) % rows))][j];
            cell.css("background-color", 'none');
            if (state == 1) {
                cell.css("background-color", 'blue');
            }
        }
    }

    //Update counter to reflect what should be the top row in the next round
    if (top_row == 0) {
        top_row = rows_to_show;
    } else {
        top_row = top_row - 1;
    }

    check_rewards();
    check_if_won_or_lost();

}

/* move_player_left()
 * Move a player one value to the left
 */
function move_player_left() {
    var position = parseInt(player.css("left"));
    var move;

    if (position == 0) {
        move = cell_size * (columns - 1);
    } else {
        move = position - cell_size;
    }

    player.css("left", move + "px");
}

/* move_player_right()
 * Move a player one value to the left
 */
function move_player_right() {
    var position = parseInt(player.css("left"));
    var move;

    if (position == cell_size * (columns - 1)) {
        move = 0;
    } else {
        move = position + cell_size;
    }

    player.css("left", move + "px");
}

/* check_rewards()
 * Update the counter to reflect award money based on duration of game play
 */
function check_rewards() {
    var milliseconds = new Date().getTime();
    var current_second = Math.floor((milliseconds / 1000.0));
    reward = Number($('#reward').text());

    if (prev_second != current_second) {
        reward = reward + 0.001;
        counter.text(reward.toFixed(3));
    }

    prev_second = current_second;
}

/* chekc_if_won_or_lost()
 * Check if player is in a winning or losing condition and submit mturk form
 */
function check_if_won_or_lost() {
    //Elapsed time
    var current_second = Math.floor(new Date().getTime() / 1000.0);
    var time = current_second - original_second;

    //Winning condition
    if (reward == 2) {
        alert("You won! The HIT will be submitted.");
        $('#elapsedTime').attr("value", time);
        $('#reward').attr("value", reward);
        $(form_selector).submit();
    }
    //Losing condition
    else {
        var position = parseInt(player.css("left"));
        position = position / cell_size;

        var state = board[(top_row + (rows_to_show)) % rows][position];
        if (state == 1) {
            alert("You lost! The HIT will be submitted.");
            $('#elapsedTime').attr("value", time);
            $('#reward').attr("value", reward);
            $(form_selector).submit();
        }
    }
}
