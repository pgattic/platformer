"use strict";
const
	canvas = document.getElementById("platformer"),
	ctx = canvas.getContext("2d"),
	pauseMenu = document.getElementById("pause"),
	$=x=>{return document.querySelector(x)},

	startingLives = 5,
	goalRadius = 15,
	goalThickness = 12,
	version = "v1.1.0";

var
	level = startLevel,
	frameDraw = 0,
	allKeys = true,
	keysCollected = [],
	score = 0,
	lives = startingLives,
	textIterator = 0,
	goalRad = 0,
	paused = false,
	editing = (editing?true:false),

	player = {
		xVel : 0,
		yVel : 0,
		x : 0,
		y : 0,
		size : [25, 50],
		stage : 1,
		color : "gray",
		upPressed : false,
		downPressed : false,
		leftPressed : false,
		rightPressed : false,
		onFloor : false,
		hitBoxMargin : [6, 12],
		maxVert : [2, 10],
		maxHoriz : [2, 2],
		jumpVel : [4, 3],
	horizAcceleration : [0.02, 0.03],
	vertAcceleration : [0.03, 0.04],
	bounce : 0.35,
	floorFriction : 0.99,
	};

document.getElementById("version").innerText = "pgattic " + version;

canvas.width = 600;
canvas.height = 600;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
	if (e.key == "ArrowLeft") {
		player.leftPressed = true;
	}
	if (e.key == "ArrowRight") {
		player.rightPressed = true;
	}
	if (e.key == "ArrowUp") {
		player.upPressed = true;
	}
	if (e.key == "Escape" && level>1) {
		togglePause();
	}
}

function keyUpHandler(e) {
	if (e.key == "ArrowLeft") {
		player.leftPressed = false;
	}
	if (e.key == "ArrowRight") {
		player.rightPressed = false;
	}
	if (e.key == "ArrowUp") {
		player.upPressed = false;
	}
}

function togglePause() { // toggles the pause variable and pause menu display
	paused = !paused;
	pauseMenu.style.display = paused ? "grid" : "none";
//	canvas.style.filter = paused ? "blur(1px)" : "blur(0)";
}

function doBoxes(obj) { // complex function to determine if a player has landed on a platfom
	if (levels[level].boxes) {
		for (var i of levels[level].boxes) {
			if (obj.x + obj.xVel + obj.size[obj.stage] - obj.hitBoxMargin[obj.stage] > i[0]
			&& obj.x + obj.xVel + obj.hitBoxMargin[obj.stage] < i[0] + i[2]
			&& (obj.y + obj.yVel + obj.size[obj.stage]) % canvas.height > i[1]
			&& (obj.y + obj.yVel + obj.size[obj.stage] - 10) % canvas.height < i[1]
			&& obj.yVel > 0) {
				obj.y = i[1] - obj.size[obj.stage];
				obj.yVel = -obj.yVel * player.bounce;
				obj.xVel *= player.floorFriction;
				if (Math.abs(obj.xVel) < 0.01) {
					obj.xVel = 0;
				}
				obj.onFloor = true;
			}
		}
	}
}

function doLava() { // Kills the player if they touch lava.
	if (levels[level].lava) {
		for (var i of levels[level].lava) {
			if (player.x < i[0] + i[2] && player.y < i[1] + i[3] && player.x + player.size[player.stage] > i[0] && player.y + player.size[player.stage] > i[1]) {
				lives--; // lives variable is unused as of now
				init();
			}
		}
	}
}

function accelerate(obj) { // Applies acceleration based on the pressed keys.
	if (obj.leftPressed) {
		obj.xVel -= player.horizAcceleration[player.stage];
	}
	if (obj.rightPressed) {
		obj.xVel += player.horizAcceleration[player.stage];
	}
	if (obj.xVel > player.maxHoriz[player.stage]) {
		obj.xVel = player.maxHoriz[player.stage];
	}
	if (obj.xVel < -player.maxHoriz[player.stage]) {
		obj.xVel = -player.maxHoriz[player.stage];
	}
	if (obj.yVel > player.maxVert[player.stage]) {
		obj.yVel = player.maxVert[player.stage];
	}
	else {
		obj.yVel += player.vertAcceleration[player.stage];
	}
}

function jump(obj) { // Jumps the player
	if (obj.onFloor && obj.upPressed) {
		obj.yVel = -player.jumpVel[player.stage];
		obj.y -= 10; // What is this for?
		obj.onFloor = false;
		obj.upPressed = false;
	}
}

function move(obj) { // applies the velocity of the player to its location
	obj.x += obj.xVel;
	obj.y += obj.yVel;
	obj.y = (obj.y + canvas.height) % canvas.height;
}

function doWall(obj) { // Bounce the player off the walls
	if (obj.x < 0) {
		obj.x = 0;
		obj.xVel *= -player.bounce;
	}
	if (obj.x > canvas.width - obj.size[obj.stage]) {
		obj.x = canvas.width - obj.size[obj.stage];
		obj.xVel *= -player.bounce;
	}
}

function collectKeys() { // Iterates through the keys and checks if the player is close enough to collect them. 
	if (levels[level].keys) {
		for (var i = 0; i < levels[level].keys.length; i++) {
			var x = player.x + player.size[player.stage] / 2 - levels[level].keys[i][0];
			var y = player.y + player.size[player.stage] / 2 - levels[level].keys[i][1];
			if (Math.sqrt(x ** 2 + y ** 2) < player.size[player.stage] / 2 + goalRadius) {
				keysCollected[i] = true;
			}
		}
	}
}

function teleport() {
	if (levels[level].portals) {
		var mostRecentPortal = [];
		for (var i = 0; i < levels[level].portals.length; i++) {
			var x = player.x + player.size[player.stage] / 2 - levels[level].portals[i][0][0];
			var y = player.y + player.size[player.stage] / 2 - levels[level].portals[i][0][1];
			if (Math.sqrt(x ** 2 + y ** 2) < player.size[player.stage] / 2) {
				player.x = levels[level].portals[i][1][0] - player.size[player.stage] / 2;
				player.y = levels[level].portals[i][1][1] - player.size[player.stage] / 2;
			}
		}
	}
}

function finishLevel() { // Checks if the player has gotten to the end of the level
	if (levels[level].end) {
		allKeys = true;
		for (var i of keysCollected) { // have all the keys been collected?
			if (i == false) {allKeys = false}
		}
//		console.log(allKeys);
		if (allKeys) {
			var x = player.x + player.size[player.stage] / 2 - levels[level].end[0];
			var y = player.y + player.size[player.stage] / 2 - levels[level].end[1];
			if (Math.sqrt(x ** 2 + y ** 2) < player.size[player.stage] / 2 + goalRadius) {
				level++;
				init();
			}
		}
	}
}

function drawBlocks() { // Draws the platforms. 
	if (levels[level].boxes) {
		for (var i of levels[level].boxes) {
			ctx.beginPath();
			ctx.rect(i[0], i[1], i[2], 10);
			ctx.fillStyle = "black";
			ctx.fill();
			ctx.closePath();
		}
	}
}

function drawGoal() { // draws the green goal semicircle
	if (levels[level].end) {
		ctx.beginPath();
		if (allKeys) {
			ctx.strokeStyle = "green";
			ctx.arc(levels[level].end[0], levels[level].end[1], goalRadius, goalRad, goalRad + Math.PI);
		} else {
			ctx.strokeStyle = "#4f4";
			ctx.arc(levels[level].end[0], levels[level].end[1], goalRadius, goalRad / 2, goalRad / 2 + Math.PI);
		}
		ctx.lineWidth = goalThickness;
		ctx.stroke();
		ctx.closePath();
	}
}

function drawKeys() { // Draws the blue circular keys.
	if (levels[level].keys) {
		for (var i = 0; i < levels[level].keys.length; i++) {
			ctx.beginPath();
			ctx.arc(levels[level].keys[i][0], levels[level].keys[i][1], goalRadius, 0, Math.PI*2);
			if (keysCollected[i]) {
				ctx.lineWidth = 4;
				ctx.strokeStyle = "black";
				ctx.stroke();
			} else {
				ctx.fillStyle = "yellow"
				ctx.fill();
			}
			ctx.closePath();
		}
	}
}

function drawPortals() {
	if (levels[level].portals) {
		for (var i = 0; i < levels[level].portals.length; i++) {
			ctx.beginPath();
			ctx.lineWidth = 4;
			ctx.strokeStyle = "purple";
			ctx.moveTo(levels[level].portals[i][0][0], levels[level].portals[i][0][1]);
			ctx.lineTo(levels[level].portals[i][1][0], levels[level].portals[i][1][1]);
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = "#ccc";
			ctx.strokeStyle = "blue";
			ctx.arc(levels[level].portals[i][0][0], levels[level].portals[i][0][1], goalRadius, 0, Math.PI*2);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = "#ccc";
			ctx.strokeStyle = "red";
			ctx.arc(levels[level].portals[i][1][0], levels[level].portals[i][1][1], goalRadius, 0, Math.PI*2);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		}
	}
}

function drawSprite(obj) { // Draws the player, can be used to draw other squares.
	ctx.beginPath();
	ctx.rect(Math.round(obj.x), Math.round(obj.y), obj.size[obj.stage], obj.size[obj.stage]);
	ctx.rect(Math.round(obj.x), Math.round(obj.y) - canvas.height, obj.size[obj.stage], obj.size[obj.stage]);
	ctx.fillStyle = obj.color;
	ctx.fill();
	ctx.closePath();
}

function drawLava() { // Draws the lava rectangles.
	if (levels[level].lava) {
		for (var i of levels[level].lava) {
			ctx.beginPath();
			ctx.rect(i[0], i[1], i[2], i[3]);
			ctx.fillStyle = "red";
			ctx.fill();
			ctx.closePath();
		}
	}
}

function drawHint() { // draws the text in the ".text" label of the level.
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.font = "15px Courier";
	if (levels[level].text) {
		ctx.fillText("> L" + level + ": " + levels[level].text.slice(0, Math.floor(textIterator)) + "_", 75, 75);
	}
	else {
		ctx.fillText("> L" + level, 75, 75);
	}
	ctx.closePath();
}

function calculate() { // Main physics function
	var calcCounter = 0;
	for (var calcCounter = 0; calcCounter < 3; calcCounter++) { // iterates the physics calculations 3 times per frame
		doBoxes(player);
		doLava();
		accelerate(player);
		jump(player);
		move(player);
		doWall(player);
		collectKeys();
		teleport();
		finishLevel();
		if (levels[level].text && textIterator < levels[level].text.length) textIterator += 0.1;
		goalRad += 0.1;
	}
}

function draw() { // Main drawing function
/*	frameDraw++;
	if (frameDraw % 1 == 0) {*/
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		drawBlocks();
		drawGoal();
		drawKeys();
		drawPortals();
		drawSprite(player);
		drawLava();
		drawHint();
//	}
}

function main() { // one function for physics, and one to draw to the canvas
	if (!paused) calculate();
	draw();
}

function init() { // used to start and restart levels
	if (!editing) {
		if (level > 1) {$("#title").style.display="none"; $("#ptip").style.display="block"}
		else {$("#title").style.display="block"; $("#ptip").style.display="none"}	
	}
	if (levels[level].start) {
		player.x = levels[level].start[0];
		player.y = levels[level].start[1];
	}
	else {
		player.x = NaN;
		player.y = NaN;
	}
	player.xVel = 0;
	player.yVel = 0;
	player.upPressed = false;
	player.downPressed = false;
	player.onFloor = false;
	textIterator = 0;
	keysCollected = [];
	if (levels[level].keys) {
		for (var i of levels[level].keys) {
			keysCollected.push(false);
		}
	}
}

init();

var interval = setInterval(main, 12);
