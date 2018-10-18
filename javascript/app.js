var simonSequence = []; //array to store sequence of Simon's moves
var mySequence = []; //array to store the player sequence
var counter = 0; // determines if it's Simon's or player's move
var roundCounter = 0; // currnet game round
var isDown = false; // to determine when the mouse is pressed down
var playerTimer = false; //determines when timed period begins for a move
var winFlashes = 0; // display winning signal
var $colors = $('.section'); // each of the clored sections stored in an array
var difficulty = "easy"; // default difficulty setting

//setting length of Simon's moves for varying difficulty
var difficultyUnits = {
  easy: {
    simonsSpeed: 1000
  },
  hard: {
    simonsSpeed: 500
  }
};

//assigning distinct sounds to each colored section and storing as objects in colorObj
var colorObj = {};
$colors.each(function() {
  var $colorName = $(this).attr('id');
  colorObj[$colorName] = {
    element: $(this),
    sound: $('#' + colorName + 'Sound') //referencing sounds by unique ID's
  };
});

//initiate game with Simon's move
function gameSequence() {
  if (counter === 0) {
    setTimeout(simonMove, 300);
  } else {
    myMove();
  }
}

function simonMove() {
  var newMove = $colors[(Math.floor(Math.random() * 4))]; //picking random colored section
  simonSequence.push(newMove); //adding Simon's move to his sequence
  lightSimonsNextColor(0); //start's Simon's sequence from the begining
  counter++; //switch from Simon to player
  roundCounter++; //tracking the number of rounds in the game
  $('#roundDisplay').text(roundCounter); //display current round
}

function lightSimonsNextColor(index) {
  var $currentColor = $(simonSequence[index]);
  var colorName = getColorName($currentColor);
  lightUpButton(colorName, true); //light up colored section with sound
