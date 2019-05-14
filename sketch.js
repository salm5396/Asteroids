var ship;
var asteroids = [];
var lasers = [];
var canPlay = true;
var score = 0;
var lives = 3;
var level = 1;

function setup() {
    var mycanvas = createCanvas(windowWidth / 1.5, windowHeight / 1.25);
    mycanvas.parent("gameCanvas");
    ship = new Ship();
    for (var i = 0; i < 5; i++) {
        asteroids.push(new Asteroid());
    }
    loop();
}

function draw() {
    background(0);
    document.getElementById("score").innerHTML = score;
    document.getElementById("lives").innerHTML = lives;

    if (asteroids.length == 0) {
        level = level + 1;
        for (var i = 0; i < 5 + level; i++) {
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

    if (!canPlay &&lives==0) {
        noLoop();
        gameOver();
    }
}

//stops boosting if the up button is released
function keyReleased() {
    ship.setRotation(0);
    ship.thrusting(false);
}

function keyPressed() {
        if (key == ' ') {
            lasers.push(new Laser(ship.pos, ship.heading));
        }
}


function restartGame() {
    ship = new Ship();
    asteroids = [];
    lasers = [];
    canPlay = true;
    score = 0;
    lives = 3;
    level = 1;
    setup();
    
}

function gameOver() {
    alert("Game Over!");
}


function hideLogin() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("container").style.display = "block";
    restartGame();
}

function checkLogin(){
	var username = document.getElementById("username").name;
	var password = document.getElementById("pass").name;
	hideLogin();
}
