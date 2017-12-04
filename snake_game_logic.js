// Global constants
const numDivisions = 25;
const minWidth = numDivisions * 4;
const maxWidth = numDivisions * 40;

var canvas = document.querySelector('canvas');
var canvas2 = createBoard(625);
drawGameBoardGrid(canvas2, 'white', 'lightgray');
var div = document.querySelector('.gameboard');
div.appendChild(canvas2);

var c1 = new Coordinates(5, 10);
var c2 = new Coordinates(6, 7);
var c3 = new Coordinates(5, 10);

console.log(c1.equals(c2));
console.log(c1.equals(c3));
console.log(c2.equals(c3));
console.log(c2.getX());
c2.setX(20);
console.log(c2.getX());
console.log(c2.getY());
 

/*
Coordinates object
*/
function Coordinates(x, y) {
	this.x = x;
	this.y = y;
	
	this.getX = function() { return this.x; }
	this.getY = function() { return this.y; }
	
	this.setX = function(x) { this.x = x; }
	this.setY = function(y) { this.y = y; }
	
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