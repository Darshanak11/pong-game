const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;
const PLAYER_X = 30;
const AI_X = canvas.width - 30 - PADDLE_WIDTH;
const PADDLE_SPEED = 7;
const BALL_SPEED = 5;

// Game state
let playerY = canvas.height/2 - PADDLE_HEIGHT/2;
let aiY = canvas.height/2 - PADDLE_HEIGHT/2;
let ballX = canvas.width/2 - BALL_SIZE/2;
let ballY = canvas.height/2 - BALL_SIZE/2;
let ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVelY = BALL_SPEED * (Math.random() * 2 - 1);

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function draw() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, '#111');

    // Middle line
    for (let i = 12; i < canvas.height; i += 32) {
        drawRect(canvas.width/2-2, i, 4, 20, '#444');
    }

    // Paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, '#0ff');
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, '#f00');

    // Ball
    drawCircle(ballX + BALL_SIZE/2, ballY + BALL_SIZE/2, BALL_SIZE/2, '#fff');
}

function resetBall() {
    ballX = canvas.width/2 - BALL_SIZE/2;
    ballY = canvas.height/2 - BALL_SIZE/2;
    ballVelX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballVelY = BALL_SPEED * (Math.random() * 2 - 1);
}

function update() {
    // Ball movement
    ballX += ballVelX;
    ballY += ballVelY;

    // Wall collision
    if (ballY <= 0) {
        ballY = 0;
        ballVelY *= -1;
    }
    if (ballY + BALL_SIZE >= canvas.height) {
        ballY = canvas.height - BALL_SIZE;
        ballVelY *= -1;
    }

    // Paddle collision (Player)
    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PLAYER_X + PADDLE_WIDTH;
        ballVelX *= -1;
        // Add some "spin"
        let hitPos = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
        ballVelY = hitPos * 0.18;
    }

    // Paddle collision (AI)
    if (
        ballX + BALL_SIZE >= AI_X &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = AI_X - BALL_SIZE;
        ballVelX *= -1;
        let hitPos = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
        ballVelY = hitPos * 0.18;
    }

    // Score detection
    if (ballX < 0 || ballX > canvas.width) {
        resetBall();
    }

    // AI movement: follow the ball, but with some lag
    let aiCenter = aiY + PADDLE_HEIGHT/2;
    if (aiCenter < ballY + BALL_SIZE/2 - 10) aiY += PADDLE_SPEED * 0.7;
    else if (aiCenter > ballY + BALL_SIZE/2 + 10) aiY -= PADDLE_SPEED * 0.7;
    // Clamp AI paddle
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Player paddle control by mouse
canvas.addEventListener('mousemove', function(e){
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT/2;
    // Clamp
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

gameLoop();