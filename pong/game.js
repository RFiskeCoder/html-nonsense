window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('pong-canvas');
  if (!canvas) {
    console.error('pong-canvas not found');
    return;
  }
  const ctx = canvas.getContext('2d');

  // Game constants
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;

  const PADDLE_WIDTH = 12;
  const PADDLE_HEIGHT = 90;
  const BALL_SIZE = 16;

  const PLAYER_X = 30;
  const AI_X = WIDTH - 30 - PADDLE_WIDTH;

  let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
  let aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

  let ballX = WIDTH / 2 - BALL_SIZE / 2;
  let ballY = HEIGHT / 2 - BALL_SIZE / 2;
  let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
  let ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);

  let playerScore = 0;
  let aiScore = 0;

  // Track mouse movement for player paddle
  canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    playerY = e.clientY - rect.top - PADDLE_HEIGHT / 2;
    playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, playerY));
  });

  function resetBall() {
    ballX = WIDTH / 2 - BALL_SIZE / 2;
    ballY = HEIGHT / 2 - BALL_SIZE / 2;
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
  }

  // Simple AI: move towards the ball
  function updateAI() {
    const aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY) {
      aiY += Math.min(7, ballY - aiCenter);
    } else if (aiCenter > ballY) {
      aiY -= Math.min(7, aiCenter - ballY);
    }
    aiY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, aiY));
  }

  function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawNet() {
    ctx.fillStyle = "#444";
    for (let i = 0; i < HEIGHT; i += 40) {
      ctx.fillRect(WIDTH / 2 - 2, i, 4, 24);
    }
  }

  function drawScores() {
    ctx.fillStyle = "#eee";
    ctx.font = "32px Arial";
    ctx.fillText(playerScore, WIDTH / 4, 40);
    ctx.fillText(aiScore, WIDTH * 3 / 4, 40);
  }

  function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    drawNet();

    // Paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#0af");
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fa0");

    // Ball
    drawCircle(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 2, "#eee");

    drawScores();
  }

  function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Collision with top/bottom
    if (ballY < 0) {
      ballY = 0;
      ballSpeedY *= -1;
    }
    if (ballY + BALL_SIZE > HEIGHT) {
      ballY = HEIGHT - BALL_SIZE;
      ballSpeedY *= -1;
    }

    // Player paddle collision
    if (
      ballX < PLAYER_X + PADDLE_WIDTH &&
      ballY + BALL_SIZE > playerY &&
      ballY < playerY + PADDLE_HEIGHT &&
      ballX > PLAYER_X - BALL_SIZE
    ) {
      ballX = PLAYER_X + PADDLE_WIDTH;
      ballSpeedX *= -1;
      // Add some "spin"
      ballSpeedY += (ballY + BALL_SIZE / 2 - (playerY + PADDLE_HEIGHT / 2)) * 0.2;
    }

    // AI paddle collision
    if (
      ballX + BALL_SIZE > AI_X &&
      ballY + BALL_SIZE > aiY &&
      ballY < aiY + PADDLE_HEIGHT &&
      ballX < AI_X + PADDLE_WIDTH + BALL_SIZE
    ) {
      ballX = AI_X - BALL_SIZE;
      ballSpeedX *= -1;
      // Add some "spin"
      ballSpeedY += (ballY + BALL_SIZE / 2 - (aiY + PADDLE_HEIGHT / 2)) * 0.2;
    }

    // Left/right scoring
    if (ballX < 0) {
      aiScore++;
      resetBall();
    } else if (ballX + BALL_SIZE > WIDTH) {
      playerScore++;
      resetBall();
    }
  }

  function gameLoop() {
    updateBall();
    updateAI();
    draw();
    requestAnimationFrame(gameLoop);
  }

  resetBall();
  gameLoop();
});
