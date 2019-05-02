var ship;
var asteroids = [];
var lasers = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    ship = new Ship();
    for (var i = 0; i < 5; i++) {
        asteroids.push(new Asteroid());
    }
}

function draw() {
    background(0);

    for (var i = 0; i < asteroids.length; i++) {
        if (ship.hits(asteroids[i])) {
            console.log('crash!');
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
    ship.render();
    ship.turn();
    ship.update();
    ship.edges();


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
