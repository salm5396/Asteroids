var ship;
var lasers = [];

//function to create the space for our game
//also creates the ship and asteroids.
function setup() {
    createCanvas(windowWidth, windowHeight);
    ship = new Ship();
}

function draw() {
    background(0);

    //big loop for lasers and asteroids hitting or going off screen
    for (var i = lasers.length - 1; i >= 0; i--) {
        lasers[i].render();
        lasers[i].update();
        if (lasers[i].offscreen()) {
            lasers.splice(i, 1);
        } 
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
    ship.boosting(false);
}
//determines what key is pressed and what to do with the ship
function keyPressed() {
    if (keyCode == 32) { // spacebar
        lasers.push(new Laser(ship.pos, ship.heading));
    } else if (keyCode == 39) { //right arrow
        ship.setRotation(0.1);
    } else if (keyCode == 37) { //up arrow
        ship.setRotation(-0.1);
    } else if (keyCode == 38) { //left arrow
        ship.boosting(true);
    }
}