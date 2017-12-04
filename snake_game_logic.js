// Global constants
const numDivisions = 25;
const minWidth = numDivisions * 4;
const maxWidth = numDivisions * 40;

var canvas = document.querySelector('canvas');
var canvas2 = createBoard(625);
drawGameBoardGrid(canvas2, 'white', 'lightgray');
var div = document.querySelector('.gameboard');
div.appendChild(canvas2);


/*

*/
function SnakeSegment(x, y, deltaX, deltaY, color, next) {
	this.coordinates = new Coordinates(x, y, deltaX, deltaY);
	this.color = color;
	this.next = next;
	
	this.directionChanges = [];
	
	this.pushChange = function(changeCoord) {
		if(typeof(changeCoord) !== typeof(new ChangeCoordinates)) {
			throw new GameLogicError("method pushChange only adds ChangeCoordinates.");
		} else {
			this.directionChanges.push(changeCoordinates);
		}
	}
	this.popChange = function() { return this.directionChanges.shift(); }
	
	this.updatePosition = function() {
		this.coordinates.setX(this.coordinates.getX() + this.coordinates.getDeltaX());
		this.coordinates.setY(this.coordinates.getY() + this.coordinates.getDeltaY());
	}
	
	this.checkForChanges = function() {
		if(this.directionChanges.length > 0) {
			
			var head = this.directionChanges[0];
			if(head.getCountdown() === 1) {
				
				if(head.getCoordinates().equals(this.coordinates)) {
					//Remove the change and apply it; update direction of current coordinates
					this.popChange();
					this.coordinates.setDeltaXandDeltaY(head.getDeltaX(), head.getDeltaY());
				} else {
					throw new GameLogicError('Changing direction but coordinates don\'t match');
				}
			}
		}
	}
	
	this.updateChanges = function() {
		for(var i = 0; i < this.directionChanges.length; i++) {
			this.directionChanges[i].decCountdown();
		}
	}
}

/*
Holds a change in coordinates
*/
function ChangeCoordinates(x, y, deltaX, deltaY, countdown) {
	this.coordinates = new Coordinates(x, y, deltaX, deltaY);
	this.countdown = countdown;
	
	this.decCountdown = function() { this.countdown--; }
	this.getCountdown() = function() { return this.countdown; }
	this.getCoordinates() = function() { return this.coordinates; }
}

/*
Coordinates object
*/
function Coordinates(x, y, deltaX, deltaY) {
	this.x = x;
	this.y = y;
	this.deltaX = deltaX;
	this.deltaY = deltaY;
	
	this.getX = function() { return this.x; }
	this.getY = function() { return this.y; }
	this.getDeltaX = function() { return this.deltaX; }
	this.getDeltaY = function() { return this.deltaY; }
	
	this.setX = function(x) { this.x = x; }
	this.setY = function(y) { this.y = y; }
	this.setDeltaXandY = function(dx, dy) {
		this.deltaX = deltaX;
		this.deltaY = deltaY;
	}
	
	this.equals = function(otherCoord) {
		return (this.x === otherCoord.x && this.y === otherCoord.y) ? true : false;
	}
}

/*
Creates a square canvas of the specified dimension
*/
function createBoard(dimension) {
	var canvas = document.createElement('canvas');
	canvas.width = canvas.height = dimension;
	return canvas;
}

/*
Draws a checkerboard grid on the canvas.
*/
function drawGameBoardGrid(canvas, color1, color2) {
	// Check to ensure canvas meets requirements
	checkCanvas(canvas);
	var width = canvas.width;
	var squareSize = width / numDivisions;
	
	var c = 0;
	var canvasCtx = canvas.getContext('2d');
	var drawColor = color1;
	for(var i = 0; i < width; i += squareSize) {
		drawColor = (c % 2 == 0) ? color1 : color2;
		
		for(var j = 0; j < width; j += squareSize) {
			canvasCtx.fillStyle = drawColor;
			canvasCtx.fillRect(i, j, squareSize, squareSize);
			drawColor = (drawColor === color1) ? color2 : color1;
		}
		c++;
	}
}

/*
Checks to ensure the canvas meets three conditions:
1-canvas must be square (width = height)
2-canvas must be divisible by numDivisions (always set to 25)
3-canvas must be >= minWidth x minWidth and <= maxWidth x maxWidth
*/
function checkCanvas(canvas) {
	var width = canvas.width;
	var height = canvas.height;
	
	if(width !== height) {
		throw new GameBoardError('canvas must be square. Currently: ' + width + 'x' + height + '.');
	}
	if(width % numDivisions !== 0) {
		throw new GameBoardError('canvas width must be divisible by numDivisions. Currently: ' +
								width + '.');
	}
	if(width < minWidth){
		throw new GameBoardError('canvas width must be >= ' + minWidth + '. Currently: ' + width + '.');
	}
	if(width > maxWidth) {
		throw new GameBoardError('canvas width must be <= ' + maxWidth + '. Currently: ' + width + '.');
	}
}

function GameLogicError(msg) {
	this.msg = msg;
	this.name = 'GameLogicError';
	this.toString = function() {
		return this.name + ': ' + this.msg;
	}
}

/*
Error for internal logic. Thrown when the gameboard is not correct.
*/
function GameBoardError(msg) {
	this.msg = msg;
	this.name = 'GameBoardError';
	this.toString = function() {
		return this.name + ': ' + this.msg;
	}
}