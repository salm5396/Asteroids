var asteroids = [];
var lasers = [];
var level = 1;
var lives = 3;
var score = 0;
var ship;
var shipCollision = false;

function setup() {
    createCanvas(windowWidth/1.25, windowHeight/1.25);
    ship = new Ship();
    for (var i = 0; i < 5; i++) {
        asteroids.push(new Asteroid());
    }
}

function draw() {
    background(0);
    document.getElementById("score").innerHTML = score;
    
    if(asteroids.length == 0){
        level = level+1;
        for (var i = 0; i < 5+level; i++) {
            asteroids.push(new Asteroid());
        }    
    }
    
     for (var i = 0; i < asteroids.length; i++) {
        if (ship.hits(asteroids[i]) && canPlay) {
            canPlay = false;
            ship.destroy();
            setTimeout(function () {
                lives--;
                if (lives > 0) {
                    ship = new Ship();
                    canPlay = true;
                }
            }, 3000);
        }
        asteroids[i].render();
        asteroids[i].update();
        asteroids[i].edges();
    }


    //outer loop for rendering lasers
    for (var i = lasers.length - 1; i >= 0; i--)
    {
        lasers[i].render();
        lasers[i].update();

        //if the laser goes off the screen, send it through the opposite side
        if (lasers[i].offscreen()) {
            lasers.splice(i, 1);
        }
        else
        {
            //loop to check each laser if it has hit an asteroid
            for (var j = asteroids.length - 1; j >= 0; j--)
            {
                if (lasers[i].hits(asteroids[j])) {
                    score += 15;

                    //if the size of the asteroid is over 20, then break it in two
                    if (asteroids[j].r > 20)
                    {
                        var newAsteroids = asteroids[j].breakup();
                        asteroids = asteroids.concat(newAsteroids);
                    }
                    asteroids.splice(j, 1);
                    lasers.splice(i, 1);
                    break;
                }
            }
        }
    }
    //stuff so that continuous pressing of buttons is okay
    if (keyIsDown(RIGHT_ARROW)) {
        ship.setRotation(0.1);
    }
    if (keyIsDown(LEFT_ARROW)) {
        ship.setRotation(-0.1);
    }
    if (keyIsDown(UP_ARROW)) {
        ship.thrusting(true);
    }

    ship.render();
    ship.turn();
    ship.update();
    ship.edges();
}

//stops thrusting if the up button is released
function keyReleased() {
    ship.setRotation(0);
    ship.thrusting(false);
}

function keyPressed() {
        if (key == ' ') {
            lasers.push(new Laser(ship.pos, ship.heading));
        }
}
