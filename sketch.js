var ship;
var lasers = [];

//function to create the space for our game
//also creates the ship and will initialize asteroids (TODO).
function setup() {
    createCanvas(windowWidth, windowHeight);
    ship = new Ship();
}

function draw() {
    background(0);

    //big loop for lasers going off screen
    for (var i = lasers.length - 1; i >= 0; i--) {
        lasers[i].render();
        lasers[i].update();
        if (lasers[i].offscreen()) {
            lasers.splice(i, 1);
        } 
    }

    //the stuff for moving spaceship or shooting lasers
    if (keyIsDown(38)) { //up arrow
        ship.thrusting(true);
    }
    if (keyIsDown(37)) { //left arrow
        ship.setRotation(-0.1);
    }
    if (keyIsDown(39)) { //right arrow
        ship.setRotation(0.1);
    }

    //updates everything needed with the ship
    ship.render();
    ship.turn();
    ship.update();
    ship.edges();


}

//when the specified key is released, stop doing that thing
function keyReleased() {
    ship.setRotation(0);
    ship.thrusting(false);
}

function keyPressed() {
    if (key == " ") { // spacebar
        lasers.push(new Laser(ship.pos, ship.heading));
    }
}
