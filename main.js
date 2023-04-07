const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let playerPaddle;
let aiPaddle;
let ball;
let cursors;
let playerSpeed = 300;
let aiSpeed = 250;

function preload() {
}

function create() {
    // Create paddles
    playerPaddle = this.physics.add.rectangle(32, config.height / 2, 20, 100, 0xffffff);
    aiPaddle = this.physics.add.rectangle(config.width - 32, config.height / 2, 20, 100, 0xffffff);

    // Create ball
    ball = this.physics.add.circle(config.width / 2, config.height / 2, 10, 0xffffff);

    // Set physics properties
    playerPaddle.setCollideWorldBounds(true);
    aiPaddle.setCollideWorldBounds(true);
    ball.setCollideWorldBounds(true);
    ball.setBounce(1, 1);
    ball.setVelocity(200, 200);

    // Set collider
    this.physics.add.collider(ball, playerPaddle, onBallHitPaddle, null, this);
    this.physics.add.collider(ball, aiPaddle, onBallHitPaddle, null, this);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Player controls
    if (cursors.up.isDown) {
        playerPaddle.setVelocityY(-playerSpeed);
    } else if (cursors.down.isDown) {
        playerPaddle.setVelocityY(playerSpeed);
    } else {
        playerPaddle.setVelocityY(0);
    }

    // AI paddle movement
    if (ball.y < aiPaddle.y) {
        aiPaddle.setVelocityY(-aiSpeed);
    } else if (ball.y > aiPaddle.y) {
        aiPaddle.setVelocityY(aiSpeed);
    } else {
        aiPaddle.setVelocityY(0);
    }

    // Check if the ball is out of bounds (left or right) and reset its position if necessary
    if (ball.x < 0 || ball.x > config.width) {
        resetBall(ball);
    }
}

function onBallHitPaddle(ball, paddle) {
    // Increase ball speed after each hit
    let newVelocityX = ball.body.velocity.x * 1.1;
    let newVelocityY = ball.body.velocity.y * 1.1;

    // Invert ball's horizontal velocity and apply the new speed
    ball.setVelocity(-newVelocityX, newVelocityY);
}

function resetBall(ball) {
    ball.setPosition(config.width / 2, config.height / 2);
    ball.setVelocity(200, 200);
}
