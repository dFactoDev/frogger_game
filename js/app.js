// Enemies our player must avoid

// CONSTANTS
//  Rows for each enemy lane
var ENEM_ROW1 = 60, 
        ENEM_ROW2 = 144,
        ENEM_ROW3 = 230;

//  Speed of enemy X movement
var MAX_SPEED = 500, MIN_SPEED = 250;

//  Player movement step size
var STEP_SIZE = 50;

var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
 
    if (this.x < ctx.canvas.width) { //if enemy not off canvas
      this.x += this.speed * dt;
    } else { // if off canvas
      // reset speed to new random
      this.speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
      // reset X pos to start from left again
      this.x = -100;
    }

    this.y;
    
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function () {
  this.sprite = 'images/char-boy.png';
  this.x = 200; // TODO: relative pos;
  this.y = 400; // TODO: relative pos;
};

Player.prototype.update = function() {
  switch(true) {
     case (this.x < 0): // player is off left edge
       this.x = 0;
       break;
     case (this.x > (ctx.canvas.width - 100)): // player is off right edge
       this.x = ctx.canvas.width - 100;
       break;
     case (this.y < 0): // player is off top edge
       this.y = -10;
       break;
     case (this.y > (ctx.canvas.height -200)): // player is off bottom edge
       this.y = ctx.canvas.height - 200;
       break;
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction) {
  switch(direction) {
    // TODO: proper values
    case 'left': 
      this.x -= STEP_SIZE;
      break;
    case 'right':
      this.x += STEP_SIZE;
      break;
    case 'down':
      this.y += STEP_SIZE;
      break;
    case 'up':
      this.y -= STEP_SIZE;
      break;
  }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

var enemy1 = new Enemy(),
        enemy2 = new Enemy();
        enemy3 = new Enemy();

enemy1.x = 0, enemy1.y = ENEM_ROW1; 
enemy2.x = 0, enemy2.y = ENEM_ROW2;
enemy3.x = 0, enemy3.y = ENEM_ROW3;

var allEnemies = [enemy1,enemy2, enemy3];

var player = new Player();

