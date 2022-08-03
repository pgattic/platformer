
 // NOTE: The editor uses code from the main game's engine to test and render levels, 
 //       so you won't find everything pertinent to the editor in this script. 


clearInterval(interval);

document.getElementById("version").innerText = "Engine: " + version +"\n Editor: v1.2.0";

const
	tools = document.getElementById("tools"),
	deleteRadius = 30,
	mousePos = document.getElementById("cursor");
	download = $("#download"),
	upload = $("#upload");

var
	mouse = {
//		downX : NaN,
//		downY : NaN,
		x : NaN,
		y : NaN,
	},
	editing = true,
	locker = 25;

canvas.addEventListener("mousedown", mouseDownHandler, false);
canvas.addEventListener("mousemove", mouseMoveHandler, false);
//canvas.addEventListener("mouseleave", mouseUpHandler, false);
canvas.addEventListener("mouseup", mouseUpHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);

download.onclick = () => {
	var a = document.getElementById("a");
	var output=JSON.stringify(levels[level]);
	a.href = URL.createObjectURL(new Blob([output], {type: "text/json"}));
	a.download = "level.json";
	a.click();
}


function readFileContent(file) {
	const reader = new FileReader();
	return new Promise((resolve, reject) => {
		reader.onload = event => resolve(event.target.result);
		reader.onerror = error => reject(error);
		reader.readAsText(file);
	});
}

function placeFileContent(target, file) {
	readFileContent(file).then(content => {
		levels[0] = JSON.parse(content);
	}).catch(error => console.log(error))
}

upload.onchange = () => {
	const input = event.target
	if ('files' in input && input.files.length > 0) {
		placeFileContent(levels[0], input.files[0]);
	}
}


function lockReplace(x) {
	return Math.round(x / locker) * locker;
}

function mouseDownHandler(e) {
	switch (tools.value) {
		case "start":
			if (e.shiftKey) {
				var dist = Math.sqrt(((levels[level].start[0]+player.size[player.stage]/2) - lockReplace(e.offsetX)) ** 2 + ((levels[level].start[1]+player.size[player.stage]/2) - lockReplace(e.offsetY)) ** 2);
				if (dist < deleteRadius) {
					levels[level].start[0] = NaN;
					levels[level].start[1] = NaN;
				}
			} else if (levels[level].start) {
				levels[level].start[0] = lockReplace(e.offsetX)-player.size[player.stage]/2;
				levels[level].start[1] = lockReplace(e.offsetY)-player.size[player.stage]/2;
			}
			break;
		case "end":
			if (e.shiftKey) {
				var dist = Math.sqrt((levels[level].end[0] - lockReplace(e.offsetX)) ** 2 + (levels[level].end[1] - lockReplace(e.offsetY)) ** 2);
				if (dist < deleteRadius) {
					levels[level].end[0] = NaN;
					levels[level].end[1] = NaN;
				}
			} else if (levels[level].end) {
				levels[level].end[0] = lockReplace(e.offsetX);
				levels[level].end[1] = lockReplace(e.offsetY);
			}
			break;
		case "plat":
			if (e.shiftKey) {
				var closestBox = [];
				for (var i = 0; i < levels[level].boxes.length; i++) {
					var dist = Math.sqrt((levels[level].boxes[i][0] - lockReplace(e.offsetX)) ** 2 + (levels[level].boxes[i][1] - lockReplace(e.offsetY)) ** 2);
					if (dist < deleteRadius && (dist < closestBox[1] || i == 0)) {
						closestBox = [i, dist];
					}
				}
				if (closestBox.length == 2) {levels[level].boxes.splice(closestBox[0], 1);}
			} else if (levels[level].boxes) {
				levels[level].boxes.unshift([lockReplace(e.offsetX), lockReplace(e.offsetY), 0]);
			}
			break;
		case "lava":
			if (e.shiftKey) {
				var closestLava = [];
				for (var i = 0; i < levels[level].lava.length; i++) {
					var dist = Math.sqrt((levels[level].lava[i][0] - lockReplace(e.offsetX)) ** 2 + (levels[level].lava[i][1] - lockReplace(e.offsetY)) ** 2);
					if (dist < deleteRadius && (dist < closestLava[1] || i == 0)) {
						closestLava = [i, dist];
					}
				}
				if (closestLava.length == 2) {levels[level].lava.splice(closestLava[0], 1);}
			} else if (levels[level].lava) {
				levels[level].lava.unshift([lockReplace(e.offsetX), lockReplace(e.offsetY), 0, 0]);
			}
			break;
		case "keys":
			if (e.shiftKey) {
				var closestKey = [];
				for (var i = 0; i < levels[level].keys.length; i++) {
					var dist = Math.sqrt((levels[level].keys[i][0] - lockReplace(e.offsetX)) ** 2 + (levels[level].keys[i][1] - lockReplace(e.offsetY)) ** 2);
					if (dist < deleteRadius && (dist < closestKey[1] || i == 0)) {
						closestKey = [i, dist];
					}
				}
				if (closestKey.length == 2) {levels[level].keys.splice(closestKey[0], 1);}
			} else if (levels[level].keys) {
				levels[level].keys.unshift([lockReplace(e.offsetX), lockReplace(e.offsetY)]);
			}
			break;
		case "port":
			if (e.shiftKey) {
				var closestPort = [];
				for (var i = 0; i < levels[level].portals.length; i++) {
					var dist = Math.sqrt((levels[level].portals[i][0][0] - lockReplace(e.offsetX)) ** 2 + (levels[level].portals[i][0][1] - lockReplace(e.offsetY)) ** 2);
					if (dist < deleteRadius && (dist < closestPort[1] || i == 0)) {
						closestPort = [i, dist];
					}
					var dista = Math.sqrt((levels[level].portals[i][1][0] - lockReplace(e.offsetX)) ** 2 + (levels[level].portals[i][1][1] - lockReplace(e.offsetY)) ** 2);
					if (dista < deleteRadius && (dista < closestPort[1] || i == 0)) {
						closestPort = [i, dista];
					}
				}
				if (closestPort.length == 2) {levels[level].portals.splice(closestPort[0], 1);}
			} else if (levels[level].portals) {
				levels[level].portals.unshift([[lockReplace(e.offsetX), lockReplace(e.offsetY)], [lockReplace(e.offsetX), lockReplace(e.offsetY)]]);
			}
			break;
	}
	editDraw();
}

function mouseMoveHandler(e) {
	if (e.buttons == 1 && !e.shiftKey) {
		switch (tools.value) {
			case "plat":
				if (levels[level].boxes.length > 0) {
					levels[level].boxes[0][2] = lockReplace(e.offsetX) - levels[level].boxes[0][0];
					holdingPlat = true;
				}
				break;
			case "lava":
				if (levels[level].lava.length > 0) {
					levels[level].lava[0][2] = lockReplace(e.offsetX) - levels[level].lava[0][0];
					levels[level].lava[0][3] = lockReplace(e.offsetY) - levels[level].lava[0][1];
					holdingLava = true;
				}
				break;
			case "port":
				if (levels[level].portals.length > 0) {
					levels[level].portals[0][1][0] = lockReplace(e.offsetX);
					levels[level].portals[0][1][1] = lockReplace(e.offsetY);
					holdingPort = true;
				}
				break;
		}
	}
	mouse.x = e.offsetX;
	mouse.y = e.offsetY;
	mousePos.innerText = lockReplace(mouse.x) + ", " + lockReplace(mouse.y);
	if (editing) editDraw();
}

function mouseUpHandler(e) {
	if (!e.shiftKey && (holdingLava||holdingPlat||holdingPort)) {
		var rect = canvas.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;
		switch (tools.value) {
			case "plat":
				levels[level].boxes[0][2] = lockReplace(mouse.x) - levels[level].boxes[0][0];
				if (levels[level].boxes[0][2] < 0) {
					levels[level].boxes[0][0] += levels[level].boxes[0][2];
					levels[level].boxes[0][2] = -levels[level].boxes[0][2]
				}
				if (levels[level].boxes[0][2] == 0) {
					levels[level].boxes.shift();
				}
				break;
			case "lava":
				levels[level].lava[0][2] = lockReplace(mouse.x) - levels[level].lava[0][0];
				levels[level].lava[0][3] = lockReplace(mouse.y) - levels[level].lava[0][1];
				if (levels[level].lava[0][2] < 0) {
					levels[level].lava[0][0] += levels[level].lava[0][2];
					levels[level].lava[0][2] = -levels[level].lava[0][2]
				}
				if (levels[level].lava[0][3] < 0) {
					levels[level].lava[0][1] += levels[level].lava[0][3];
					levels[level].lava[0][3] = -levels[level].lava[0][3]
				}
				if (levels[level].lava[0][2] == 0 || levels[level].lava[0][3] == 0) {
					levels[level].lava.shift();
				}
				break;
			case "port":
				levels[level].portals[0][1][0] = lockReplace(mouse.x);
				levels[level].portals[0][1][1] = lockReplace(mouse.y);
				break;
		}
		editDraw();
	}
	holdingLava = false, // these holding vars help determine if any of these are currently being added to the level (so it can make them translucent).
	holdingPlat = false,
	holdingPort = false;
}

function editDrawGrid() {
	if (locker >= 5) {
		ctx.lineWidth = 0.5;
		ctx.strokeStyle = "#000";
		for (var i = 0; i < canvas.width / locker; i++) {
			ctx.beginPath();
			ctx.moveTo(i * locker, 0);
			ctx.lineTo(i * locker, canvas.height);
			ctx.stroke();
			ctx.closePath();
		}
		for (var i = 0; i < canvas.height / locker; i++) {
			ctx.beginPath();
			ctx.moveTo(0, i * locker);
			ctx.lineTo(canvas.width, i * locker);
			ctx.stroke();
			ctx.closePath();
		}
	}
}

function editDrawGoal() { // draws the green goal semicircle
	if (levels[level].end) {
		ctx.beginPath();
		ctx.strokeStyle = "green";
		ctx.arc(levels[level].end[0], levels[level].end[1], goalRadius, 0, Math.PI * 2);
		ctx.lineWidth = goalThickness;
		ctx.stroke();
	}
	if (tools.value == "end") {
		ctx.beginPath();
		ctx.arc(lockReplace(mouse.x), lockReplace(mouse.y), goalRadius, 0, Math.PI * 2);
		ctx.lineWidth = goalThickness;
		ctx.strokeStyle = "green";
		ctx.globalAlpha = 0.5;
		ctx.stroke();
		ctx.globalAlpha = 1;
	}
}

function editDrawKeys() { // Draws the blue circular keys.
	if (levels[level].keys) {
		for (var i = 0; i < levels[level].keys.length; i++) {
			ctx.beginPath();
			ctx.arc(levels[level].keys[i][0], levels[level].keys[i][1], goalRadius, 0, Math.PI*2);
			ctx.fillStyle = "yellow"
			ctx.fill();
		}
	}
	if (tools.value == "keys") {
		ctx.beginPath();
		ctx.arc(lockReplace(mouse.x), lockReplace(mouse.y), goalRadius, 0, Math.PI*2);
		ctx.fillStyle = "yellow"
		ctx.globalAlpha = 0.5;
		ctx.fill();
		ctx.globalAlpha = 1;
	}
}

function editDrawSprite(obj) {
	ctx.beginPath();
	ctx.rect(levels[level].start[0], levels[level].start[1], obj.size[obj.stage], obj.size[obj.stage]);
	ctx.rect(levels[level].start[0], levels[level].start[1] - canvas.height, obj.size[obj.stage], obj.size[obj.stage]);
	ctx.fillStyle = obj.color;
	ctx.fill();

	if (tools.value == "start") {
		ctx.beginPath();
		ctx.rect(lockReplace(mouse.x-obj.size[obj.stage]/2), lockReplace(mouse.y-obj.size[obj.stage]/2), obj.size[obj.stage], obj.size[obj.stage]);
		ctx.rect(lockReplace(mouse.x-obj.size[obj.stage]/2), lockReplace(mouse.y-obj.size[obj.stage]/2) - canvas.height, obj.size[obj.stage], obj.size[obj.stage]);
		ctx.fillStyle = obj.color;
		ctx.globalAlpha = 0.5;
		ctx.fill();
		ctx.globalAlpha = 1;
	}
}

function editDrawHint() {
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.font = "15px Courier";
	if (levels[level].text) {
		ctx.fillText("> L" + level + ": " + levels[level].text + "_", 75, 75);
	}
	else {
		ctx.fillText("> L" + level, 75, 75);
	}
	ctx.closePath();
}

function editDraw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	if (editing) editDrawGrid();
	drawBlocks();
	editDrawGoal();
	editDrawKeys();
	drawPortals();
	editDrawSprite(player);
	drawLava();
	editDrawHint();
}

editDraw();

function togglePause() {
	editing = !editing;
	if (editing) {
		clearInterval(interval);
		editDraw();
	}
	else {
		interval = setInterval(main, 12);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		init();
	}
}

function finishLevel() { // Checks if the player has gotten to the end of the level
	if (levels[level].end) {
		allKeys = true;
		for (var i of keysCollected) { // have all the keys been collected?
			if (i == false) {allKeys = false}
		}
		if (allKeys) {
			var x = player.x + player.size[player.stage] / 2 - levels[level].end[0];
			var y = player.y + player.size[player.stage] / 2 - levels[level].end[1];
			if (Math.sqrt(x ** 2 + y ** 2) < player.size[player.stage] / 2 + goalRadius) {
				init();
			}
		}
	}
}
