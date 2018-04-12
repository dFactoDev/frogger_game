"use strict";

// // CONSTANTS

//  Player boundaries
var BOUNDARY_TOP = [0,1,2,3,4], BOUNDARY_BTM = [25,26,27,28,29],
        BOUNDARY_L = [0,5,10,15,20,25], BOUNDARY_R = [4,9,14,19,24,29];
// Blocks of different terrain to determine actions in relation to player position
var WATER_BLOCKS = [0,1,2,3,4],
        PAVING_BLOCKS = [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
        GRASS_BLOCKS = [20,21,22,23,24,25,26,27,28,29];

// Points scored for each step
var POINTS_STEP = 50;

var score = 0, highscore = 0,
        treasure_step = 0; //counter to control treasure activation

var allTreasures = [];
var activeTreasures = [];
var allEnemies = [];  

var pause_input = false; //stops input when modal displayed

// DOM Elements
var domScore = document.querySelector('.score span'),
        domHighScore = document.querySelector('.highscore span'),
        domCongrats = document.querySelector('div.congrats');

var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    
    this.min_speed = 10; 
    this.max_speed = 100;
    
    this.height = 60;
    this.width = 80;
    this.y_adjust = -20; // adjusts y to align image with grid
    this.frequency = 1; // how frequent appears - less is more
  
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
 
    //if enemy not off canvas
    if (this.x < ( canvas_blocks[BOUNDARY_R[0]][1] 
            + this.frequency * row_size)) { 
      this.x += this.speed * dt; // move character further
    } else { // if off canvas
      // reset speed to new random
      this.speed = Math.random() 
              * (this.max_speed - this.min_speed) 
              + this.min_speed;
      // reset X pos to start from left again
      this.x = -100; //start off-screen for smoother visual
    }
    
    //to get coordinates for collision detection
    this.bottom_y = this.y + this.height; 
    this.right_x = this.x + this.width;
    
    
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function () {
  this.sprite = 'images/char-boy.png';
    
  this.y_adjust = -10; // adjust y to allign image with grid
  this.moved = false; // true if moved from last position
  
};

Player.prototype.update = function() {
    
  //get and set x and y associated with currently assigned canvas block  
  this.x = canvas_blocks[this.current_block][1];
  this.y = canvas_blocks[this.current_block][2] + this.y_adjust;
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction) {
  
  // block input if true (for game won modal)
  if(pause_input) { return; };
  
  // for each case, check if current block is one of the blocks on the 
  // boundary and if false then increment current block otherwise nothing
  switch(direction) {
    case 'left': 
      if (BOUNDARY_L.indexOf(this.current_block) < 0) {
        this.current_block -= 1;
        this.moved = true;
      }
      break;
    case 'right':
      if (BOUNDARY_R.indexOf(this.current_block) < 0) { 
        this.current_block += 1;
        this.moved = true;
      }
      break;
    case 'down':
      if (BOUNDARY_BTM.indexOf(this.current_block) < 0) {
        this.current_block += 5;
        this.moved = true;
      }
      break;
    case 'up':
      if (BOUNDARY_TOP.indexOf(this.current_block) < 0) { 
        this.current_block -= 5;
        this.moved = true;
      }
      break;
  }
};

var Treasure = function () {
  this.sprite = '';
  this.interval = 0; // after how many points the treasure should appear
  this.points_factor = 0; // how much current score is multiplied with when hit
  this.hit = false; //true when player hits treasure
  this.y_adjust = -35; // adjust y position to aligh with grid 
};

Treasure.prototype.update = function() {
  // if step count is in interval of this treasure, make active
  if (treasure_step > 0 &&
          activeTreasures.length === 0 &&
          treasure_step % this.interval === 0 && 
          !this.hit) { activeTreasures.push(this); }  
  
  // get and set x/y from current block assignment
  this.x = canvas_blocks[this.current_block][1];
  this.y = canvas_blocks[this.current_block][2] + this.y_adjust;
  
};

Treasure.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Treasure.prototype.randomizePos = function() {
  //randomize block of treasure
  this.current_block = 
      randomMinMaxInt(PAVING_BLOCKS[0],PAVING_BLOCKS[PAVING_BLOCKS.length-1]);
};

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

function randomMinMaxInt(min,max) {
  // return Integer (i.e non-float) of random number
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function initEnemies() {

  // set enemy position and speed
  enemy1.x = 0, enemy1.y = canvas_blocks[5][2] + enemy1.y_adjust, 
          enemy1.min_speed = 70, enemy1.max_speed = 100, enemy1.frequency = 1;
  enemy2.x = 0, enemy2.y = canvas_blocks[5][2] + enemy2.y_adjust,
          enemy2.min_speed = 70, enemy2.max_speed = 100, enemy2.frequency = 3;
  enemy3.x = 0, enemy3.y = canvas_blocks[10][2] + enemy3.y_adjust,
          enemy3.min_speed = 70, enemy3.max_speed = 100, enemy3.frequency = 1;
  enemy4.x = 0, enemy4.y = canvas_blocks[10][2] + enemy4.y_adjust, 
          enemy4.min_speed = 100, enemy4.max_speed = 130, enemy4.frequency = 12;
  enemy5.x = 0, enemy5.y = canvas_blocks[15][2] + enemy5.y_adjust,
          enemy5.min_speed = 70, enemy5.max_speed = 100, enemy5.frequency = 1;
  enemy6.x = 0, enemy6.y = canvas_blocks[15][2] + enemy6.y_adjust, 
          enemy6.min_speed = 100, enemy6.max_speed = 130, enemy6.frequency = 15;

  allEnemies = [enemy1, enemy2, enemy3, enemy5];
  
  // randomize speed for each enemy
  allEnemies.forEach(function(enemy) {
    enemy.speed = Math.random() * (enemy.max_speed - enemy.min_speed) 
          + enemy.min_speed;
  });
  
}

function initPlayers() {
  
  player.height = 60;
  player.width = 65;
  player.current_block = 27; 
  treasure_step = 0;
  
}


function initTreasures() {

  treasure_orange.sprite = "images/Gem-Orange.png";
  treasure_orange.points_factor = 1;
  treasure_orange.interval = 30;

  treasure_blue.sprite = "images/Gem-Blue.png";
  treasure_blue.points_factor = 0.5;
  treasure_blue.interval = 20;

  treasure_green.sprite = "images/Gem-Green.png";
  treasure_green.points_factor = 0.25;
  treasure_green.interval = 10;

  allTreasures = [treasure_blue, treasure_green, treasure_orange];
  
  // randomize block for each treasure
  allTreasures.forEach(function(treasure) {
    treasure.randomizePos();
    treasure.hit = false;
  });
  
  // make all treasures inactive
  activeTreasures.splice(0);

}

//construct objects

var player = new Player();
var treasure_orange = new Treasure(),
      treasure_blue = new Treasure(),
      treasure_green = new Treasure();
var enemy1 = new Enemy(),
      enemy2 = new Enemy(),
      enemy3 = new Enemy(),
      enemy4 = new Enemy(),
      enemy5 = new Enemy(),
      enemy6 = new Enemy();
