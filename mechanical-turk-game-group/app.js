//Variables that can be configured
var rows = 7;
var columns = 6;
var rows_to_show = 6;
var cell_size = 50; // in pixels
//var max_obstacles_per_row = 3 ;
var max_obstacles_per_row = 1;
var speed_of_game = 1000; // Time for each grid update cycle 
var form_selector = "#mturk_form";

var board = [];

var top_row;
var ship_location = 0;
var gameboard;
var player;
var collective;
var counter;
var reward = 0;
var collective_reward = 0;
var original_second;
var prev_second;
var update_interval;
var game_id;
var game_mode = 'median' ;

//For group play
var group_key = "ireneAV52pnKP6KbS7"
var status = 'setup';

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

    status = 'playing';
    startGame();
});

/* create_board_div()
 * Creates the DIV for the game board
 */
function create_board_divs() {
    //Create HTML board
    gameboard = $("<div id='gameboard'></div>");
    gameboard.width(columns * cell_size);
    gameboard.height(rows_to_show * cell_size);

    $(document.body).append(gameboard);
}

/* create_board()
 * Creates the board randomly
 */
function create_board() {
    //Fill the board with no state 
    for (var i = 0; i < rows; i++) {
        board[i] = [];
        for (var j = 0; j < columns; j++) {
            board[i][j] = 0;
        }
    }

    //Create the game board randomly
    for (var i = 0; i < rows; i++) {
        //Max obstacles per row
        var num_ones = Math.floor((Math.random() * max_obstacles_per_row));

        for (var j = 0; j <= num_ones; j++) {
            var position = Math.floor((Math.random() * columns));
            var state = board[i][position];
            while (state == 1) {
                position = Math.floor((Math.random() * columns));
                state = board[i][position];
                break;
            }

            board[i][position] = 1;
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

    collective = $("<div class='collective'></div>");
    collective.css("width", cell_size + "px");
    collective.css("height", cell_size + "px");
    collective.css("top", (rows_to_show - 1) * cell_size);
    collective.css("left", 0);
    $(gameboard).append(collective);
}

/* update_grid()
 * Update a grid using an offset based a counter
 */
function update_grid(time) {

    var milliseconds = Math.floor(time % rows);
    var offset = Math.abs(milliseconds - 6);
    top_row = offset;

    for (var i = 0; i < rows; i++) {

        for (var j = 0; j < columns; j++) {
            var cell_name = 'gamecell_r' + i + '_c' + j;
            var cell = $('#' + cell_name);

            var state = board[Math.abs(((i + offset) % rows))][j];
            cell.css("background-color", 'none');
            if (state == 1) {
                cell.css("background-color", 'blue');
            }
        }
    }

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

/* check_if_won_or_lost()
 * Check if player is in a winning or losing condition and submit mturk form
 */
function check_if_won_or_lost() {
    var current_second = Math.floor(new Date().getTime() / 1000.0);
    var time = current_second - original_second;

    //Winning condition
    if (collective_reward > 2 || status == 'won') {
        status = 'won';
        board = 0;
        clearInterval(update_interval);
        alert("You or your collaborators won! The HIT will be submitted.");
        $('#elapsedTime').attr("value", time);
        $('#reward_money').attr("value", collective_reward);
        $(form_selector).submit();
        lose_or_win_condition();

    }
    //Losing condition
    else {
        var position = parseInt(collective.css("left"));
        position = position / cell_size;

        var state = board[(top_row + (rows_to_show)) % rows][position];
        if (state == 1 || status == 'lost') {
            status = 'lost';
            board = 0;
            clearInterval(update_interval);
            alert("You lost or the crowd lost! The HIT will be submitted.");
            $('#elapsedTime').attr("value", time);
            $('#reward_money').attr("value", collective_reward);
            $(form_selector).submit();
            lose_or_win_condition();
        }
    }
}

//********** GROUP PLAY CODE **************//

/* startGame()
 * Executes just one to see if there is an ongoing game
 */
function startGame() {
    var data = { ship_position: 0, status: 'setup', board: 0, game_key: 0, reward: 0, mode: game_mode };
    $.ajax({
        url: "https://codingthecrowd.com/counter.php",

        dataType: "jsonp",
        data: {
            key: group_key,
            data: JSON.stringify(data)
        },

        success: function(response) {
            game_id = setup_or_create_board(response);
            console.log("Game ID is " + game_id);
            update_interval = setInterval(updateBoard, 1000);
        },
        error: function(response) {
            console.log(response);
        }
    });
}

/* setup_or_create_board()
 * Function to update or create a new board
 */
function setup_or_create_board(response) {
    var id = 0; //store game id
    var exists = false;
    var count = response.count;
    var array = response.results;

    for (var i = 0; i < count; i++) {
        var player_state = array[i];
        var json = JSON.parse(player_state.data);
        var player_board = json.board;
        var player_mode = json.mode ;

        //If another player has already setup a board then do not create one
        if (player_board != 0) {
            console.log("Board already exists");
            exists = true;
            board = player_board;
            create_board_divs();
            id = json.game_key;
            game_mode = player_mode ; // Set game mode to what the other player already setup
        }
    }

    //If board does not exists after parsing through all other player states
    //Create board and also take in a game mode
    if (exists == false) {
        create_board_divs();
        create_board();
        id = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

        var mode = getParameterByName('mediator');
        if(mode != null) {
            game_mode = mode ;
        }
    }

    create_grids();
    create_counter();
    create_player();

    return id;
}

/* lose_or_win_condition()
 * Called once when game is own or lose
 */
function lose_or_win_condition() {
    var position = parseInt(player.css("left")) / cell_size;
    var data = { ship_position: position, status: status, board: board, game_key: game_id, reward: reward, mode: game_mode };

    $.ajax({
        url: "https://codingthecrowd.com/counter.php",

        dataType: "jsonp",
        data: {
            key: group_key,
            data: JSON.stringify(data)
        },

        success: function(response) {
            console.log("Sending lose or winning condition");
        },
        error: function(response) {
            console.log(response);
        }
    });
}

/* udpateBoard()
 * Called every second to update the board
 */
function updateBoard() {
    var position = parseInt(player.css("left")) / cell_size;
    var data = { ship_position: position, status: status, board: board, game_key: game_id, reward: reward, mode: game_mode };

    $.ajax({
        url: "https://codingthecrowd.com/counter.php",

        dataType: "jsonp",
        data: {
            key: group_key,
            data: JSON.stringify(data)
        },

        success: function(response) {
            process_group_play(response);
        },
        error: function(response) {
            console.log(response);
        }
    });
}

/* process_group_play
 * Funciton to update the board based on scores of other players
 */
function process_group_play(response) {
    //Array to store the state of other players in the game
    var plays = [];

    var count = response.count;
    var array = response.results;

    var positions = [];
    collective_reward = 0;
    reward = reward + 0.001;

    for (var i = 0; i < count; i++) {
        var player_state = array[i];
        var json = JSON.parse(player_state.data);
        var current_game_key = json.game_key;
        var player_reward = json.reward;

        if (current_game_key == game_id) {
            var player_ship_position = json.ship_position;
            var player_status = json.status;

            collective_reward = collective_reward + player_reward;

            if (player_status == 'playing') {
                positions.push(player_ship_position);
            }

            if (player_status == 'lost') {
                console.log("Detected other player lost");
                status = 'lost';
            }

            if (player_status == 'won') {
                console.log("Detected other player won");
                status = 'won';
            }
            //console.log(json) ;
        }
    }

    counter.text(collective_reward.toFixed(3));
    if(game_mode == 'median') {
        console.log("Playing in median mode") ;
        update_collective(Math.floor(median(positions)));
    }
    if(game_mode == 'better') {
        console.log("Playing in better/average mode") ;
        update_collective(Math.floor(better(positions)));
    }
    update_grid(response.time);
}

/* update_collective()
 * Update position of the group player icon
 */
function update_collective(position) {
    var move = position * cell_size;
    collective.css("left", move + "px");
}

/* randomString()
 * Used to create random game ID
 */
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

/* median()
 * Calculates median of an array
 */
function median(values) {
    values.sort(function(a, b) {
        return a - b; });
    var half = Math.floor(values.length / 2);

    if (values.length % 2)
        return values[half];
    else
        return (values[half - 1] + values[half]) / 2.0;
}

/* better()
 * Calculate move based on averaging the positions that all players have voted for
 */
function better(values) {
    var total = 0 ;
    for(var i = 0; i < values.length; i++) {
        total += values[i];
    }

    var average = Math.round(total / values.length) ;
    return average ;
}

/* getParameterByName()
 * get URL parameter
 */
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
