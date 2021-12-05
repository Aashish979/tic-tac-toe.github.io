window.onload = () => {
  //js code here

  const boxes = document.querySelectorAll(".Mcontainer div");
  const info_box = document.getElementById("result");
  const restart = document.getElementById("restart");

  let startMusic = new Audio('tictac/music.mp3');
  let audioTurn = new Audio('tictac/turn.mp3');
  let cheers = new Audio('tictac/cheers.mp3');
  let draw = new Audio('tictac/draw.mp3');
 

  let player = "O",
  game_over = false;
  let board = [...Array(9)].fill("x");
  boxes.forEach((ele, index) => {
    ele.onclick = () => {
      if (board[index] == "x" && !game_over) {
        player = player == "X" ? "O" : "X";
        info_box.innerHTML = `Turn : ${player == "X" ? "O" : "X"}`;
        audioTurn.play();
        board[index] = ele.innerHTML = player;
        gameOver();
      }
    };
  });

  const gameOver = () => {
    for (let i = 0; i < 9; i += 3) {
      if (
        board[i] !== "x" &&
        board[i] == board[i + 1] &&
        board[i] == board[i + 2]
        ) {
        info_box.innerHTML = `WINNER : ${player}`;
        cheers.play();
        document.getElementById('img1').style.width = '120px';
      game_over = true;
      return;
    }
  }
  for (let i = 0; i < 3; i++) {
    if (
      board[i] !== "x" &&
      board[i] == board[i + 3] &&
      board[i] == board[i + 6]
      ) {
      info_box.innerHTML = `WINNER : ${player}`;
     cheers.play();
      document.getElementById('img1').style.width = '120px';
    game_over = true;
    return;
  }
}
if (board[0] !== "x" && board[0] == board[4] && board[0] == board[8]) {
  info_box.innerHTML = `Winner : ${player}`;
   cheers.play();
  document.getElementById('img1').style.width = '120px'
  game_over = true;
  return;
}
if (board[2] !== "x" && board[2] == board[4] && board[2] == board[6]) {
  info_box.innerHTML = `WINNER : ${ player}`
  cheers.play();
  document.getElementById('img1').style.width = '120px';
  game_over = true;
  return;
}
if (board.every((ele) => ele !== "x")) {
  info_box.innerHTML = "DRAW..!!";
  draw.play()
  document.getElementById('img2').style.width = '120px';
  game_over = true;
  return;
}
};

const restartGame = () => {
  (player = "O"), (game_over = false);
  board = [...Array(9)].fill("x");
  boxes.forEach((ele) => {
    ele.innerHTML = "";
  });
  info_box.innerHTML = "Turn :";
  document.getElementById('img1').style.width = '0px';
  document.getElementById('img2').style.width = '0px';
  cheers.pause();
  startMusic.play();
};
restart.addEventListener("click", restartGame);
};
