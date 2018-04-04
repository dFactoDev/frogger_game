// CONSTANTS
//  Column and Row sizes
var ROW_H = 83, COL_W = 101;
//  Rows for each enemy lane
var ENEM_ROW1 = 1 * ROW_H - 20, 
        ENEM_ROW2 = 2 * ROW_H - 20,
        ENEM_ROW3 = 3 * ROW_H - 20;
//  Player boundaries
var BOUNDARY_TOP = -10, BOUNDARY_BTM = 405,
        BOUNDARY_L = 0, BOUNDARY_R = 404;
// Paving boundaries. Steps in this space count points.
var PAVING_TOP = 73, PAVING_BTM = 239;

// Player avatar size
var PLAYER_W = 100, PLAYER_H = 170;
// Points scored for each step
var POINTS_STEP = 50;

var score = 0;
var player_last_y = 0, player_last_x = 0; //player position before last update



var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    
    this.min_speed = 50;
    this.max_speed = 250;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
 
    if (this.x < (COL_W * 5)) { //if enemy not off canvas
      this.x += this.speed * dt; // move character further
    } else { // if off canvas
      // reset speed to new random
      this.speed = Math.random() * (this.max_speed - this.min_speed) + this.min_speed;
      // reset X pos to start from left again
      this.x = -100; //start off-screen for smoother visual
    }
    
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function () {
  this.sprite = 'images/char-boy.png';
  this.x = COL_W * 2; // TODO: relative pos;
  this.y = BOUNDARY_BTM; // TODO: relative pos;
};

Player.prototype.update = function() {
  switch(true) {
     case (this.x < BOUNDARY_L): // player is off left edge
       this.x = BOUNDARY_L;
       break;
     case (this.x > BOUNDARY_R): // player is off right edge
       this.x = BOUNDARY_R;
       break;
     case (this.y < BOUNDARY_TOP): // player is off top edge
       this.y = BOUNDARY_TOP;
       break;
     case (this.y > BOUNDARY_BTM): // player is off bottom edge
       this.y = BOUNDARY_BTM;
       break;
  }
  
  // if player has movedm
  if(player_last_y !== this.y || player_last_x !== this.x) {
    // then if player position is within paved area 
    if(this.y <= PAVING_BTM && this.y >= PAVING_TOP) {
       score += POINTS_STEP;
       console.log(score);
    } 
    // if below paving and points already scored
    else if (this.y > PAVING_BTM && score > 0) { 
      score -= POINTS_STEP;
      console.log(score);
    }
  }
  
  player_last_y = this.y, player_last_x = this.x;
  
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction) {
  switch(direction) {
    // TODO: proper values
    case 'left': 
      this.x -= COL_W;
      break;
    case 'right':
      this.x += COL_W;
      break;
    case 'down':
      this.y += ROW_H;
      break;
    case 'up':
      this.y -= ROW_H;
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
        enemy2 = new Enemy(),
        enemy3 = new Enemy(),
        enemy4 = new Enemy(),
        enemy5 = new Enemy(),
        enemy6 = new Enemy();

enemy1.x = 0, enemy1.y = ENEM_ROW1; 
enemy2.x = 0, enemy2.y = ENEM_ROW1, 
        enemy2.min_speed = 250, enemy2.max_speed = 400;
enemy3.x = 0, enemy3.y = ENEM_ROW2;
enemy4.x = 0, enemy4.y = ENEM_ROW2, 
        enemy4.min_speed = 250, enemy4.max_speed = 400;
enemy5.x = 0, enemy5.y = ENEM_ROW3; 
enemy6.x = 0, enemy6.y = ENEM_ROW3, 
        enemy6.min_speed = 250, enemy6.max_speed = 400;


var allEnemies = [enemy1,enemy2, enemy3, enemy4, enemy5, enemy6];

var player = new Player();

