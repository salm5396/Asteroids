var ship;
var asteroids = [];
var lasers = [];
var canPlay = true;
var score = 0;
var lives = 3;
var level = 1;
var secondVersion = false;
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
    document.getElementById("score").value = score;
    document.getElementById("lives").innerHTML = lives;

    if (asteroids.length == 0) {
        if (secondVersion) {
            level *= 2;
        }
        else {
            level = level + 1;
        }
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

    if(keyIsDown(32)&&secondVersion){
    	lasers.push(new Laser(ship.pos, ship.heading));
    }

    ship.render();
    ship.turn();
    ship.update();
    ship.edges();

    if (!canPlay &&lives==0) {
        noLoop();
        gameOver();
	document.getElementById("currscore").submit();
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
    secondVersion = false;
    score = 0;
    lives = 3;
    level = 1;
    setup();
    
}

function gameOver() {
    
    alert("Game Over!");
}
function changeVersion() {
    secondVersion = true;
    alert("Hard Mode Activated! Double the Asteroids each round");
}


function Asteroid(pos, r) {
    if (pos) {
        this.pos = pos.copy();
    } else {
        this.pos = createVector(random(width), random(height))
    }
    if (r) {
        this.r = r * 0.5;
    } else {
        this.r = random(40, 50);
    }

    this.vel = p5.Vector.random2D();

    //10 total asteroids rendered
    this.total = 10;
    this.offset = [];
    for (var i = 0; i < this.total; i++) {
        this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
    }


    //moves the asteroid by updating position vector
    this.update = function () {
        this.pos.add(this.vel);
    }

    this.render = function () {
        push();
        stroke(255);
        noFill();
        translate(this.pos.x, this.pos.y);
        //ellipse(0, 0, this.r * 2);
        beginShape();

        //creates the weird jagged asteroid like the game
        for (var i = 0; i < this.total; i++) {
            var angle = map(i, 0, this.total, 0, TWO_PI);
            var r = this.r + this.offset[i];
            var x = r * cos(angle);
            var y = r * sin(angle);
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }


    //object function for breaking the asteroid in two
    this.breakup = function () {
        var newA = [];
        newA[0] = new Asteroid(this.pos, this.r);
        newA[1] = new Asteroid(this.pos, this.r);
        return newA;
    }

    this.edges = function () {
        if (this.pos.x > width + this.r) {
            this.pos.x = -this.r;
        } else if (this.pos.x < -this.r) {
            this.pos.x = width + this.r;
        }
        if (this.pos.y > height + this.r) {
            this.pos.y = -this.r;
        } else if (this.pos.y < -this.r) {
            this.pos.y = height + this.r;
        }
    }

}

function Laser(spos, angle) {
    this.pos = createVector(spos.x, spos.y);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(10);

    this.update = function () {
        this.pos.add(this.vel);
    }

    this.render = function () {
        push();
        stroke(255);
        strokeWeight(4);
        point(this.pos.x, this.pos.y);
        pop();
    }

    this.hits = function (asteroid) {
        var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
        if (d < asteroid.r) {
            return true;
        } else {
            return false;
        }
    }

    this.offscreen = function () {
        if (this.pos.x > width || this.pos.x < 0) {
            return true;
        }
        if (this.pos.y > height || this.pos.y < 0) {
            return true;
        }
        return false;
    }


}


function Ship() {
    this.pos = createVector(width / 2, height / 2);
    this.r = 20;
    this.heading = 0;
    this.rotation = 0;
    this.vel = createVector(0, 0);
    this.isThrusting = false;
    this.isDestroyed = false;
    this.destroyFrames = 600;

    this.thrusting = function (b) {
        this.isThrusting = b;
    }

    this.thrust = function () {
        var force = p5.Vector.fromAngle(this.heading);
        force.mult(0.1);
        this.vel.add(force);
    }

    this.update = function () {
        if (this.isThrusting) {
            this.thrust();
        }
        this.pos.add(this.vel);
        if (this.isDestroyed) {
            for (var i = 0; i < this.brokenParts.length; i++) {
                this.brokenParts[i].pos.add(this.brokenParts[i].vel);
                this.brokenParts[i].heading += this.brokenParts[i].rot;
            }
        }
        else {
            this.vel.mult(0.99);
        }
        
    }

    this.brokenParts = [];
    this.destroy = function () {
        this.isDestroyed = true;
        for (var i = 0; i < 4; i++)
            this.brokenParts[i] = {
                pos: this.pos.copy(),
                vel: p5.Vector.random2D(),
                heading: random(0, 360),
                rot: random(-0.07, 0.07)
            };
    }

    this.hits = function (asteroid) {
        var d = dist(this.pos.x, this.pos.y, asteroid.pos.x, asteroid.pos.y);
        if (d < this.r + asteroid.r) {
            return true;
        } else {
            return false;
        }
    }

    this.render = function () {
        if (this.isDestroyed) {
            for (var i = 0; i < this.brokenParts.length; i++) {
                push();
                stroke(floor(255 * ((this.destroyFrames--) / 600)));
                var bp = this.brokenParts[i];
                translate(bp.pos.x, bp.pos.y);
                rotate(bp.heading);
                line(-this.r / 2, -this.r / 2, this.r / 2, this.r / 2);
                pop();
            }
        }
        else {
            push();
            translate(this.pos.x, this.pos.y);
            rotate(this.heading + PI / 2);
            fill(0);
            stroke(255);
            triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
            pop();
        }  
    }

    this.edges = function () {
        if (this.pos.x > width + this.r) {
            this.pos.x = -this.r;
        } else if (this.pos.x < -this.r) {
            this.pos.x = width + this.r;
        }
        if (this.pos.y > height + this.r) {
            this.pos.y = -this.r;
        } else if (this.pos.y < -this.r) {
            this.pos.y = height + this.r;
        }
    }

    this.setRotation = function (a) {
        this.rotation = a;
    }

    this.turn = function () {
        this.heading += this.rotation;
    }

}

function getIcon(){
  var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			fillIcon(this.responseText);
		}
	};
	xhttp.open("GET", "/icon",true);
	xhttp.send();
}

function fillIcon(data){
	var icon = JSON.parse(data).picture;
	var area = document.getElementById("icon");
	area.innerHTML = "";
	var tag = "<img style='width:30%;height:30%;' src=" + icon + ">";
	area.innerHTML = tag;
}

function getLeaderboard() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      fillBoard(this.responseText);
    }
  };
  xhttp.open("GET", "/leaderboard", true);
  xhttp.send();
}

function fillBoard(serverData){
	console.log(JSON.parse(serverData));
	var data = JSON.parse(serverData);
	var board = document.getElementById("leaderboard");
	board.innerHTML = "";//enmptys table of previous data
	var htmlStr = "";
	var current;
	var user = "";
	var highscore;
	var played = 0;	
	for(var i = 0; i < data.length; i++){
		user = data[i].username;
		highscore = data[i].highscore;
		played = data[i].played;
		var newRow = board.insertRow(-1);
		htmlStr="<td>" + user + "</td><td>" + highscore + "</td><td>" + played +"</td>";
		newRow.innerHTML =htmlStr;
		newRow.style.backgroundColor = "white";
	}
}
