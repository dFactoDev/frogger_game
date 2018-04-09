"use strict";

// // CONSTANTS
//  Rows for each enemy lane
var ENEM_ROW1 = 1 * row_size - 20, 
        ENEM_ROW2 = 2 * row_size - 20,
        ENEM_ROW3 = 3 * row_size - 20;
//  Player boundaries
var BOUNDARY_TOP = [0,1,2,3,4], BOUNDARY_BTM = [25,26,27,28,29],
        BOUNDARY_L = [0,5,10,15,20,25], BOUNDARY_R = [4,9,14,19,24,29];
// Blocks of different terrain to determine actions in relation to player position
var WATER_BLOCKS = [0,1,2,3,4],
        PAVING_BLOCKS = [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
        GRASS_BLOCKS = [20,21,22,23,24,25,26,27,28,29];

// Points scored for each step
var POINTS_STEP = 50;
var DEBUG = true;

var score = 0, highscore = 0, game_won = false;
var player_last_y = 0, player_last_x = 0; //player position before last update

var allTreasures = [];
var allEnemies = [];  

var pause_input = false;

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
    
    this.min_speed = 50;
    this.max_speed = 250;
    
    this.height = 60;
    this.width = 80;
        
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
 
    if (this.x < ( row_size * 6)) { //if enemy not off canvas
      this.x += this.speed * dt; // move character further
    } else { // if off canvas
      // reset speed to new random
      this.speed = Math.random() * (this.max_speed - this.min_speed) + this.min_speed;
      // reset X pos to start from left again
      this.x = -100; //start off-screen for smoother visual
    }
    
    this.bottom_y = this.y + this.height; 
    this.right_x = this.x + this.width;
    
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


var Player = function () {
  this.sprite = 'images/char-boy.png';
    
  this.y_adjust = -10; // adjust y to allign better with grid
  this.moved = false;
  
};

Player.prototype.update = function() {
    
  this.x = canvas_blocks[this.current_block][1];
  this.y = canvas_blocks[this.current_block][2] + this.y_adjust;
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction) {
  
  if(pause_input) { return; };
  
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
  this.score_min = 0; // after how many points the treasure should appear
  this.points = 0; // how many points this treasure adds to total
  this.active = false; //toggles if in array of active treasures
  this.hit = false; //true when player hits treasure
  this.y_adjust = -35; // adjust y position to aligh with grid 
};

Treasure.prototype.update = function() {
  (score >= this.score_min && !this.hit) ? this.active = true : this.active = false;  
 
  this.x = canvas_blocks[this.current_block][1];
  this.y = canvas_blocks[this.current_block][2] + this.y_adjust;
  
};

Treasure.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function initEnemies() {

  enemy1.x = 0, enemy1.y = ENEM_ROW1; 
  enemy2.x = 0, enemy2.y = ENEM_ROW1, 
          enemy2.min_speed = 200, enemy2.max_speed = 400;
  enemy3.x = 0, enemy3.y = ENEM_ROW2;
  enemy4.x = 0, enemy4.y = ENEM_ROW2, 
          enemy4.min_speed = 150, enemy4.max_speed = 300;
  enemy5.x = 0, enemy5.y = ENEM_ROW3; 
  enemy6.x = 0, enemy6.y = ENEM_ROW3, 
          enemy6.min_speed = 150, enemy6.max_speed = 250;

  allEnemies = [enemy1, enemy2, enemy3, enemy5];
  
  allEnemies.forEach(function(enemy) {
    enemy.speed = Math.random() * (enemy.max_speed - enemy.min_speed) 
          + enemy.min_speed;
  });
  
}

function initPlayers() {
  
  player.height = 60;
  player.width = 65;
  player.current_block = 27; 
  
}


function initTreasures() {

  treasure_orange.sprite = "images/Gem-Orange.png";
  treasure_orange.points_factor = 1;
  treasure_orange.score_min = 2000;

  treasure_blue.sprite = "images/Gem-Blue.png";
  treasure_blue.points_factor = 0.5;
  treasure_blue.score_min = 750;

  treasure_green.sprite = "images/Gem-Green.png";
  treasure_green.points_factor = 0.25;
  treasure_green.score_min = 250;

  allTreasures = [treasure_blue, treasure_green, treasure_orange];

  allTreasures.forEach(function(treasure) {
    treasure.current_block = 
          randomMinMaxInt(PAVING_BLOCKS[0],PAVING_BLOCKS[PAVING_BLOCKS.length-1]);
    treasure.hit = false;
    treasure.active = false;
  });

}

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
