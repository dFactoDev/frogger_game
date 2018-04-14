/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make 
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        row_size = 83,
        col_size = 101,
        canvas_blocks = [], // blocks/cells of grid
        add_enemy_score1 = 80000, //add another enemy after this many points
        add_enemy_score2 = 200000, //add another enemy after this many points
        treasures_hit = 0,
        speed_inc  = 0.25;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        checkScore();
        render();
        updateDom(score, domScore, highscore, domHighScore);

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {

        
         /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;
        
         /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                canvas_blocks.push([rowImages[row],col * col_size,row * row_size]);
            }
        }
        reset();
        lastTime = Date.now();
        main();
    }

    

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        checkTreasureHit();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        allTreasures.forEach(function(treasure) {
            treasure.update();
        });
        player.update(); 
    }

    function checkScore() {
      // if player has moved
      if(player.moved) {
        checkEnemies();
        // then if player position is within paved area, increase score
        if(PAVING_BLOCKS.indexOf(player.current_block) > -1) {
           score += POINTS_STEP;
           treasure_step += 1;
        } 
        // if on grass and points already scored, decrease score
        else if (GRASS_BLOCKS.indexOf(player.current_block) > -1 && score > 0) { 
          score -= POINTS_STEP;
          treasure_step -= 1;
        }
        // if on water, game won
        else if (WATER_BLOCKS.indexOf(player.current_block) > -1) {
          gameWon();
        }
      }

      player.moved = false; // reset moved state
    }

    function checkEnemies() {
      if (score > add_enemy_score1 && allEnemies.indexOf(enemy6) === -1) {
        allEnemies.push(enemy6); // add another enemy to game
      }
      if (score > add_enemy_score2 && allEnemies.indexOf(enemy4) === -1) {
        allEnemies.push(enemy4); // add another enemy to game
      }
    }

    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
          // if whole of x scale of player overlaps with that of enemy
          if (player.y>= (enemy.y - player.height) 
                  && player.y <= enemy.bottom_y) {
            // and if same for y scale
            if (player.x >= (enemy.x - player.width) && 
                    player.x <= enemy.right_x) {
              // then collision detected, reset elements
              reset();
            }
          }
        });
    }
    
    function checkTreasureHit() {
      activeTreasures.forEach(function(treasure) {
        // if player in same block as treasure (ie. if treasure is hit)
        if(treasure.current_block === player.current_block) {
          //multiply score with factor set for the treasure
          score += Math.floor(score * treasure.points_factor);
          treasure.hit = true;
          treasures_hit += 1; // to keep track how many treasures hit
          //remove treasure from array (ie. make inactive)
          activeTreasures.splice(activeTreasures.indexOf(this),1);
        } 
      });
      // if all treasures have been hit
      if (treasures_hit === allTreasures.length) { 
        //reset treasure positions and state
        initTreasures();
        //reset hit count
        treasures_hit = 0;    
        allEnemies.forEach(function(enemy) {
          //increase max_speed of all enemies to increase dufficulty
          enemy.max_speed += enemy.max_speed * speed_inc;
        });
      }
    }

    function updateDom(score, elScore, highscore, elHighScore) {
      // update score and highscore display on DOM
      elScore.innerHTML = score.toString();
      elHighScore.innerHTML = highscore.toString();
    }
    
    function gameWon() {
      var congratsMsg;
      var domMsgElement = domCongrats.querySelector('h2');
      
      if(score > highscore) {
        // if score is higher than last highscore
        highscore = score;
        domMsgElement.style.color = 'green';
        congratsMsg = "NEW High Score: " + score;
      } else {
        domMsgElement.style.color = 'blue';
        congratsMsg = "Score: " + score;
      }
      
      pause_input = true; // pause input while modal is displated
      domMsgElement.innerHTML = congratsMsg;
      domCongrats.style.display = 'block'; // display modal
      setTimeout(reset,1500); // reset after 1.5sec, which hides modal again
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        
        // Before drawing, clear existing canvas
        ctx.clearRect(0,0,canvas.width,canvas.height);

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        canvas_blocks.forEach( function(block) {
          
          
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(block[0]), block[1], block[2]);
            });

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        activeTreasures.forEach(function(treasure) {
            treasure.render();
        });
        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        domCongrats.style.display = 'none'; //hide congrats modal
        pause_input = false; // allow input again
        score = 0; // reset score
        initEnemies();
        initPlayers();
        initTreasures();
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Gem-Orange.png',
        'images/Gem-Blue.png',
        'images/Gem-Green.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
    global.canvas_blocks = canvas_blocks;
    global.col_size = col_size;
    global.row_size = row_size;
    
})(this);
