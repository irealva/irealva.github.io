
/**
  Name: Spotify Artist and Album Search
  Author: Irene Alvarado
  Description: A simple web search program that uses the Spotify Metadata API 
  to take an artist’s name and find their most recent album.
*/

var moods = ['happy', 'angry', 'sad', 'relaxing', 'excited' ] ;
var styles = ['rock', 'alternative', 'jazz', 'classical', 'indie'] ;

$('#search').click(function(e) {
  e.preventDefault(); //prevents form from reloading page
  //requestArtist() ;
  requestCategory();
});

var requestCategory = function() {
  //var category = $('#category'.val()) ;

  var mood = moods[Math.floor(Math.random()*moods.length)];
  var style = styles[Math.floor(Math.random()*styles.length)];

  $.ajax({
      url: 'http://developer.echonest.com/api/v4/artist/search?api_key=A7OTGZVDUSIXYXLQN&format=json&style='+style+'&mood='+mood+'&results=1',
      success: function(data) {
        var found = data.response.artists[0] ;

        var id = found.id ;
        var name = found.name ;

        console.log(id + " " + name) ;
        requestArtist(name) ;
        showCategory(mood, style) ;
      }
  })

}


/**
 * Makes an ajax request to the Spotify API to find an artist ID based on
 * user input. 
 */
var requestArtist = function(name) {
  //var artist = $('#artist').val();
  var artist = name ;

  $.ajax({
      url: 'https://api.spotify.com/v1/search?q='+artist+'&type=artist&limit=1',
      success: function(data) {
        if (typeof data.artists.items[0] !== 'undefined') {
          requestAlbum(data.artists.items[0].name, data.artists.items[0].id) ;
        }
        else { //if artist name doesn't return any results
          var error = $('#error') ;
          error.html('<div id="error"><h2>Artist not found, try again.</h2></div>') ;
        }
      }
    }) ;
  
} ;

/**
 * Makes an ajax request to the Spotify API to find the latest album by an 
 * artist based on their ID. 
 * @param {name} the name of the artist
 * @param {id} the id of the artist
 */
var requestAlbum = function(name, id) {
  $.ajax({
      url: 'https://api.spotify.com/v1/artists/'+id+'/albums?album_type=album',
      success: function(data) {
        album = data.items[0] ;
        showResults(name, album) ;
      }
    }) ;
} ;

/**
 * Replaces a div in index.html to show the results of the Spotify search
 * @param {name} the name of the artist
 * @param {album} the album of the artist
 */
var showResults = function(name, album) {
  var replaceResults = $('#main') ;
  var name = name ;
  var albumTitle = album.name ;
  var image = album.images[0].url ;

  var string = '<div><h1>'+name + ':</h1>' +
          '<h1>'+albumTitle+'<br></h1>' +
          '</div>' ;

  replaceResults.html(string) ;

  var replaceCover = $('#albumCover') ;  
  var coverString = '<img class="img-responsive" src="' + image + '">' ;
  replaceCover.html(coverString) ;
};

var showCategory = function(mood, style) {
  //var replaceResults = $('#main') ;
  //var string = '<div><h1>' + '</h1></div>' ;
  //replaceResults.html(string) ;


  console.log(mood) ;
  console.log(style) ;
  var addmoodstyle = $('#mood-style') ;
  var string2 = 'Your friends feel '+mood + '. Share the mood, listen to this ' + style + ' album.' ;
  addmoodstyle.html(string2) ;

}

requestCategory();

