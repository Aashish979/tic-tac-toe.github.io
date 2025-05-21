window.onload = () => {
  const boxes = document.querySelectorAll(".Mcontainer .cell");
  const info_box = document.getElementById("result");
  const restart = document.getElementById("restart");
  const modeSelect = document.getElementById("mode");

  const music = new Audio("media/music.mp3");
  const audioTurn = new Audio("media/turn.mp3");
  const cheers = new Audio("media/cheers.mp3");
  const drawSound = new Audio("media/draw.mp3");

  let board, player, gameOver, mode;

  const initGame = () => {
    // Stop all sounds
    cheers.pause();
    cheers.currentTime = 0;
    drawSound.pause();
    drawSound.currentTime = 0;
    audioTurn.pause();
    audioTurn.currentTime = 0;
    
    // Play start music
    music.currentTime = 0;
    music.play();

    board = Array(9).fill("");
    player = Math.random() < 0.5 ? "X" : "O"; // Random first turn between Player and AI
    gameOver = false;
    mode = modeSelect.value;
    boxes.forEach((box) => (box.textContent = ""));
    document.getElementById("img1").style.width = "0";
    document.getElementById("img2").style.width = "0";
    // Remove any existing winning lines
    const winningLines = document.querySelectorAll('.winning-line');
    winningLines.forEach(line => line.remove());

    if (mode === "single" && player === "O") {
      info_box.innerHTML = "AI Thinking..."; // Show AI is thinking if AI goes first
      aiMove(); // If AI goes first, make AI move
    } else {
      info_box.innerHTML = `Turn: ${player}`; // Show Player turn if Player goes first
    }
  };

  const checkWinner = () => {
    const wins = [
      [0, 1, 2, "horizontal", 16.67],
      [3, 4, 5, "horizontal", 50],
      [6, 7, 8, "horizontal", 83.33],
      [0, 3, 6, "vertical", 16.67],
      [1, 4, 7, "vertical", 50],
      [2, 5, 8, "vertical", 83.33],
      [0, 4, 8, "diagonal", -45],
      [2, 4, 6, "diagonal", 45],
    ];

    for (let [a, b, c, lineType, position] of wins) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        info_box.innerHTML = `WINNER: ${board[a]}`;
        document.getElementById("img1").style.width = "120px";
        cheers.play();
        gameOver = true;

        // Create and add winning line
        const line = document.createElement("div");
        line.className = `winning-line ${lineType}`;

        if (lineType === "horizontal") {
          line.style.top = `${position}%`;
          line.style.transformOrigin = "left";
          line.style.transform = "scaleX(0)";
        } else if (lineType === "vertical") {
          line.style.left = `${position}%`;
          line.style.transformOrigin = "top";
          line.style.transform = "scaleY(0)";
        } else if (lineType === "diagonal") {
          // line.style.top = "-13%";
          line.style.transformOrigin = "left";
          line.style.transform = `rotate(${position}deg) scaleY(0)`;
        }

        document.querySelector(".Mcontainer").appendChild(line);
        // Trigger animation
        setTimeout(() => line.classList.add("show"), 50);
        return true;
      }
    }

    if (board.every((cell) => cell !== "")) {
      info_box.innerHTML = "DRAW..!!";
      document.getElementById("img2").style.width = "120px";
      drawSound.play();
      gameOver = true;
      return true;
    }
    return false;
  };

  const makeMove = (index, currentPlayer) => {
    board[index] = currentPlayer;
    boxes[index].textContent = currentPlayer;

    // Prevent overlapping audio
    audioTurn.pause();
    audioTurn.currentTime = 0;
    audioTurn.play();
  };

  const aiMove = () => {
    if (gameOver) return;

    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, 0, false);
        board[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    setTimeout(() => {
      makeMove(move, "O");
      checkWinner();
      if (!gameOver) {
        player = "X";
        info_box.innerHTML = `Turn: ${player}`;
      }
    }, 500); // AI delay
  };

  const minimax = (boardState, depth, isMaximizing) => {
    const winner = getWinner(boardState);
    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (!boardState.includes("")) return 0;

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === "") {
          boardState[i] = "O";
          let score = minimax(boardState, depth + 1, false);
          boardState[i] = "";
          best = Math.max(score, best);
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === "") {
          boardState[i] = "X";
          let score = minimax(boardState, depth + 1, true);
          boardState[i] = "";
          best = Math.min(score, best);
        }
      }
      return best;
    }
  };

  const getWinner = (b) => {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b1, c] of wins) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return null;
  };

  boxes.forEach((box, i) => {
    box.addEventListener("click", () => {
      if (gameOver || board[i] !== "") return;

      if (mode === "single") {
        if (player === "X") {
          makeMove(i, "X");
          if (!checkWinner()) {
            player = "O";
            info_box.innerHTML = `AI Thinking...`;
            aiMove();
          }
        }
      } else {
        makeMove(i, player);
        if (!checkWinner()) {
          player = player === "X" ? "O" : "X";
          info_box.innerHTML = `Turn: ${player}`;
        }
      }
    });
  });

  restart.addEventListener("click", () => {
    // Fade out cells
    boxes.forEach(box => {
      box.style.transition = 'opacity 0.3s';
      box.style.opacity = '0';
    });

    // Fade out winning line if exists
    const winningLines = document.querySelectorAll('.winning-line');
    winningLines.forEach(line => {
      line.style.transition = 'opacity 0.3s';
      line.style.opacity = '0';
    });

    // Wait for fade out, then init game and fade in
    setTimeout(() => {
      initGame();
      boxes.forEach(box => {
        box.style.opacity = '1';
      });
    }, 300);
  });
  modeSelect.addEventListener("change", initGame);

 initGame(); // Start game on load
};




