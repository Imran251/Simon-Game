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
    sound: $('#' + $colorName + 'Sound') //referencing sounds by unique ID's
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

  setTimeout(function() {
      $currentColor.css('filter', 'brightness(100%)');
      var nextIndex = index + 1;

      if (nextIndex < simonSequence.length) { //checking if all of Simon's sequence has been played back
        setTimeout(function() {
          lightSimonsNextColor(nextIndex);
        }, difficultyUnits[difficulty].simonsSpeed / 2); //time in between each button press
      } else {
        beginPlayersTurn();
        startTimer();
      }
}, difficultyUnits[difficulty].simonsSpeed); //turning off button based on difficutly

}

function beginPlayersTurn() {
  mySequence = [];
}

//player has 5 seconds to complete move
function startTimer() {
  clearInterval(playerTimer);
  var countDown = 6;
  playerTimer = setInterval(function() {
    countDown = countDown - 1;
    $("#timeToMove").text(countDown);
    if (countDown < 1) { // end the game when time runs out
      gameOver();
    }
  }, 1000)
}


function myMove() {
  $("#timeToMove").text("5");

  //countdown between moves, resets after move
  if (playerTimer) {
    clearInterval(playerTimer);
  }

  if (!compareLastButtonPress()) { //if player makes wrong move in sequence, end game
    gameOver();
    return; //stops comparing sequences
  }

  if (mySequence.length == simonSequence.length) { // Determine if the turn was completed or not
    var equality = compareArrays(mySequence, simonSequence)
    if (equality) {
      if (roundCounter == 6) { //number of rounds needed to win the game
        userWin();
      } else {
        setTimeout(simonMove, 1500);
      }
    } else {
      gameOver();
    }
  } else {
    startTimer(); //restart the timer for each move
  }
}

function compareLastButtonPress() { //comparing current move with one before it
  var index = mySequence.length - 1;
  var lastButton = getColorName(mySequence[index]);
  var simonsMoveAtIndex = getColorName(simonSequence[index]);

  return lastButton == simonsMoveAtIndex;
}

function compareArrays(arr1, arr2) { //checking if each of the moves are the same
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
