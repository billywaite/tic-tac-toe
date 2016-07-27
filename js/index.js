$('#board').hide();
$('#play').hide();

$(document).ready(function() {
  
  var player;
  var opponent;
  var myTurn = false;
  var turns = 0;
  var board = [
    [3, 2, 3],
    [2, 4, 2],
    [3, 2, 3]
  ];

  /***************************************
   Player Chooses their piece + Intro Sequence

  ****************************************/
  $('#x').click(function() {
    player = 'X';
    opponent = 'O';
    new_player();
  });
  $('#o').click(function() {
    player = 'O';
    opponent = 'X';
    new_player();
  });

  function new_player() {
    $('.intro').hide();
    $('#board').fadeIn(3000);
    $('#play').fadeIn(3000);
    myTurn = true;
    main();
  }

  /*************************************************
           Player Click - Edits internal and external board
  *************************************************/
  function main() {
    $('.col-xs-4').click(function() {
      if ($(this).is(':empty')) {
        var cell = $(this).attr('id');
        var row = parseInt(cell[1]);
        var column = parseInt(cell[2]);
      }
      if (myTurn == true) {
        board[row][column] = player;
        makeMove([row, column]);
      }
    });
  }
  /*************************************************
  External board is edited, internal board evaluated for win
  *************************************************/
  function makeMove([row, column]) {

    addSymbol();
    checkWin();
    heuristics([row, column]);
    AI();

  }

  //add symbol to the board after click
  function addSymbol() {
    turns++;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if (board[i][j] === player && $("#" + "b" + i + "" + j).is(':empty')) {
          $("#" + "b" + i + "" + j).text(player);
        } else if (board[i][j] === opponent && $("#" + "b" + i + "" + j).is(':empty')) {
          $("#" + "b" + i + "" + j).text(opponent);
        }
      }
    }
  }

  //check if there is a straight, vertical, or diagonal win
  function checkWin() {
    var wins = [
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      [board[0][0], board[1][1], board[2][2]],
      [board[2][0], board[1][1], board[0][2]]
    ];

    for (var i in wins) {
      if (wins[i][0] == player && wins[i][1] == player && wins[i][2] == player) {
        document.getElementById("winner").innerHTML = "You won!";
        board = [];
        reset();
      } else if (wins[i][0] == opponent && wins[i][1] == opponent && wins[i][2] == opponent) {
        document.getElementById("winner").innerHTML = "You lost!";
        board = [];
        reset();
      } else if (turns == 9) {
        document.getElementById("winner").innerHTML = "It's a Draw!";
        board = [];
        reset();
      }
    }
  }
  //if there is an end game state, call reset
  function reset() {
    $('.ending').css("display", "block");
    $('#reset').click(function() {
      board = [
        [3, 2, 3],
        [2, 4, 2],
        [3, 2, 3]
      ];
      turns = 0;

      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {

          $("#" + "b" + i + "" + j).text('');
          $('.ending').css("display", "none");

          $('#board').hide();
          $('#play').hide();
          $('.intro').show();
        }
      }
    });
  }

  /*****************************************************
      Computer
     ***************************************************/
  function AI() {
    myTurn = false;

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {

        var linear = board[0].concat(board[1], board[2]);

        if (linear.indexOf(player) == linear.lastIndexOf(player) && linear.indexOf(opponent) < 0 && !isNaN(board[1][1])) {
          board[1][1] = opponent;
          addSymbol();
          checkWin();
          heuristics([i, j]);
          myTurn = true;
          return;
        } else if (linear.indexOf(player) == linear.lastIndexOf(player) && linear.indexOf(opponent) < 0 && board[i][j] == 3) {
          board[i][j] = opponent;
          addSymbol();
          checkWin();
          heuristics([i, j]);
          myTurn = true;
          return;
        }
        //have to use all numbers in Math.max or else it returns NaN
        for (var i in linear) {
          if (linear[i] == opponent) {
            linear[i] = -2;
          } else if (linear[i] == player) {
            linear[i] = -1;
          }
        }
        var max = Math.max(...linear);

        var index = linear.indexOf(max);
        if (index <= 2) {
          board[0][index] = opponent;

          addSymbol();
          checkWin();
          heuristics([i, j]);
          myTurn = true;
          return;
        } else if (index > 2 && index <= 5) {
          board[1][index - 3] = opponent;
          addSymbol();
          checkWin();
          heuristics([i, j]);
          myTurn = true;
          return;
        } else if (index > 5) {
          board[2][index - 6] = opponent;
          addSymbol();
          checkWin();
          heuristics([i, j]);
          myTurn = true;
          return;
        }
      }
    }

  }

  //Heuristics - point additions 
  function heuristics([l, m]) {

    //heuristics for opponent in winning scenario
    if (board[0][0] == opponent && board[0][1] == opponent && !isNaN(board[0][2])) {
      board[0][2] += 1000;
    } else if (board[0][0] == opponent && board[0][2] == opponent && !isNaN(board[0][1])) {
      board[0][1] += 1000;
    } else if (board[0][1] == opponent && board[0][2] == opponent && !isNaN(board[0][0])) {
      board[0][0] += 1000;
    } else if (board[1][0] == opponent && board[1][1] == opponent && !isNaN(board[1][2])) {
      board[1][2] += 1000;
    } else if (board[1][0] == opponent && board[1][2] == opponent && !isNaN(board[1][1])) {
      board[1][1] += 1000;
    } else if (board[1][1] == opponent && board[1][2] == opponent && !isNaN(board[1][0])) {
      board[1][0] += 1000;
    } else if (board[2][0] == opponent && board[2][1] == opponent && !isNaN(board[2][2])) {
      board[2][2] += 1000;
    } else if (board[2][0] == opponent && board[2][2] == opponent && !isNaN(board[2][1])) {
      board[2][1] += 1000;
    } else if (board[2][1] == opponent && board[2][2] == opponent && !isNaN(board[2][0])) {
      board[2][0] += 1000;
    } else if (board[0][0] == opponent && board[1][0] == opponent && !isNaN(board[2][0])) {
      board[2][0] += 1000;
    } else if (board[0][0] == opponent && board[2][0] == opponent && !isNaN(board[1][0])) {
      board[1][0] += 1000;
    } else if (board[1][0] == opponent && board[2][0] == opponent && !isNaN(board[0][0])) {
      board[0][0] += 1000;
    } else if (board[0][1] == opponent && board[1][1] == opponent && !isNaN(board[2][1])) {
      board[2][1] += 1000;
    } else if (board[0][1] == opponent && board[2][1] == opponent && !isNaN(board[1][1])) {
      board[1][1] += 1000;
    } else if (board[1][1] == opponent && board[2][1] == opponent && !isNaN(board[0][1])) {
      board[0][1] += 1000;
    } else if (board[0][2] == opponent && board[1][2] == opponent && !isNaN(board[2][2])) {
      board[2][2] += 1000;
    } else if (board[0][2] == opponent && board[2][2] == opponent && !isNaN(board[1][2])) {
      board[1][2] += 1000;
    } else if (board[1][2] == opponent && board[2][2] == opponent && !isNaN(board[0][2])) {
      board[0][2] += 1000;
    } else if (board[0][0] == opponent && board[1][1] == opponent && !isNaN(board[2][2])) {
      board[2][2] += 1000;
    } else if (board[0][0] == opponent && board[2][2] == opponent && !isNaN(board[1][1])) {
      board[1][1] += 1000;
    } else if (board[1][1] == opponent && board[2][2] == opponent && !isNaN(board[0][0])) {
      board[0][0] += 1000;
    } else if (board[0][2] == opponent && board[1][1] == opponent && !isNaN(board[2][0])) {
      board[2][0] += 1000;
    } else if (board[0][2] == opponent && board[2][0] == opponent && !isNaN(board[1][1])) {
      board[1][1] += 1000;
    } else if (board[1][1] == opponent && board[2][0] == opponent && !isNaN(board[0][2])) {
      board[0][2] += 1000;
    }

    //heuristics for player in winning scenario
    if (board[0][0] == player && board[0][1] == player && !isNaN(board[0][2])) {
      board[0][2] += 1000;
    } else if (board[0][0] == player && board[0][2] == player && !isNaN(board[0][1])) {
      board[0][1] += 1000;
    } else if (board[0][1] == player && board[0][2] == player && !isNaN(board[0][0])) {
      board[0][0] += 1000;
    } else if (board[1][0] == player && board[1][1] == player && !isNaN(board[1][2])) {
      board[1][2] += 1000;
    } else if (board[1][0] == player && board[1][2] == player && !isNaN(board[1][1])) {
      board[1][1] += 1000;
    } else if (board[1][1] == player && board[1][2] == player && !isNaN(board[1][0])) {
      board[1][0] += 1000;
    } else if (board[2][0] == player && board[2][1] == player && !isNaN(board[2][2])) {
      board[2][2] += 1000;
    } else if (board[2][0] == player && board[2][2] == player && !isNaN(board[2][1])) {
      board[2][1] += 1000;
    } else if (board[2][1] == player && board[2][2] == player && !isNaN(board[2][0])) {
      board[2][0] += 1000;
    } else if (board[0][0] == player && board[1][0] == player && !isNaN(board[2][0])) {
      board[2][0] += 1000;
    } else if (board[0][0] == player && board[2][0] == player && !isNaN(board[1][0])) {
      board[1][0] += 1000;
    } else if (board[1][0] == player && board[2][0] == player && !isNaN(board[0][0])) {
      board[0][0] += 1000;
    } else if (board[0][1] == player && board[1][1] == player && !isNaN(board[2][1])) {
      board[2][1] += 1000;
    } else if (board[0][1] == player && board[2][1] == player && !isNaN(board[1][1])) {
      board[1][1] += 1000;
    } else if (board[1][1] == player && board[2][1] == player && !isNaN(board[0][1])) {
      board[0][1] += 1000;
    } else if (board[0][2] == player && board[1][2] == player && !isNaN(board[2][2])) {
      board[2][2] += 1000;
    } else if (board[0][2] == player && board[2][2] == player && !isNaN(board[1][2])) {
      board[1][2] += 1000;
    } else if (board[1][2] == player && board[2][2] == player && !isNaN(board[0][2])) {
      board[0][2] += 1000;
    } else if (board[0][0] == player && board[1][1] == player && !isNaN(board[2][2])) {
      board[2][2] += 1000;
    } else if (board[0][0] == player && board[2][2] == player && !isNaN(board[1][1])) {
      board[1][1] += 1000;
    } else if (board[1][1] == player && board[2][2] == player && !isNaN(board[0][0])) {
      board[0][0] += 1000;
    } else if (board[0][2] == player && board[1][1] == player && !isNaN(board[2][0])) {
      board[2][0] += 1000;
    } else if (board[0][2] == player && board[2][0] == player && !isNaN(board[1][1])) {
      board[1][1] += 1000;
    } else if (board[1][1] == player && board[2][0] == player && !isNaN(board[0][2])) {
      board[0][2] += 1000;
    }

    //bottom layer heuristic +10
    if (l == 0) {
      if (m == 0) {
        if (!isNaN(board[1][0])) {
          board[1][0] += 10;
        }
        if (!isNaN(board[0][1])) {
          board[0][1] += 10;
        }
      } else if (m == 1) {
        if (!isNaN(board[0][0])) {
          board[0][0] += 10;
        }
        if (!isNaN(board[0][2])) {
          board[0][2] += 10;
        }
        if (!isNaN(board[1][1])) {
          board[1][1] += 10;
        }
      } else if (m == 2) {
        if (!isNaN(board[0][1])) {
          board[0][1] += 10;
        }
        if (!isNaN(board[1][2])) {
          board[1][2] += 10;
        }
      }
    } else if (l == 1) {
      if (m == 0) {
        if (!isNaN(board[0][0])) {
          board[0][0] += 10;
        }
        if (!isNaN(board[2][0])) {
          board[2][0] += 10;
        }
        if (!isNaN(board[1][1])) {
          board[1][1] += 10;
        }
      } else if (m == 1) {
        if (!isNaN(board[0][1])) {
          board[0][1] += 10;
        }
        if (!isNaN(board[1][0])) {
          board[1][0] += 10;
        }
        if (!isNaN(board[1][2])) {
          board[1][2] += 10;
        }
        if (!isNaN(board[2][1])) {
          board[2][1] += 10;
        }
      } else if (m == 2) {
        if (!isNaN(board[0][2])) {
          board[0][2] += 10;
        }
        if (!isNaN(board[1][1])) {
          board[1][1] += 10;
        }
        if (!isNaN(board[2][2])) {
          board[2][2] += 10;
        }
      }
    } else if (l == 2) {
      if (m == 0) {
        if (!isNaN(board[1][0])) {
          board[1][0] += 10;
        }
        if (!isNaN(board[2][1])) {
          board[2][1] += 10;
        }
      } else if (m == 1) {
        if (!isNaN(board[2][0])) {
          board[2][0] += 10;
        }
        if (!isNaN(board[1][1])) {
          board[1][1] += 10;
        }
        if (!isNaN(board[2][2])) {
          board[2][2] += 10;
        }
      } else if (m == 2) {
        if (!isNaN(board[2][1])) {
          board[2][1] += 10;
        }
        if (!isNaN(board[1][2])) {
          board[1][2] += 10;
        }
      }
    }

  }

}); //end document ready