

// Global constants
const numDivisions = 25;
const minWidth = numDivisions * 4;
const maxWidth = numDivisions * 40;

var canvas = document.querySelector('canvas');
var canvasWidth = canvas.width;
var squareSize = canvasWidth / numDivisions;
drawGameBoardGrid(canvas, 'white', 'lightgray');
drawSquare(canvas, squareSize, 0, 0, 'blue', 'lightblue');
drawSquare(canvas, squareSize, 0, 1, 'blue', 'lightblue');
drawSquare(canvas, squareSize, 0, 2, 'blue', 'lightblue');
drawSquare(canvas, squareSize, 0, 3, 'blue', 'lightblue');

/*
var s = new SnakeSegment(-1, -1, 'blue');
var n = new SnakeSegment(25, 0, 'green');
var b = new SnakeSegment(0, 25, 'green');
var h = new SnakeSegment(3, -6, 'green');
var j = new SnakeSegment(3, 6, 'green');
var k = new SnakeSegment(3, 24, 'green');
var l = new SnakeSegment(24, 0, 'green');
var o = new SnakeSegment(0, 1, 'green');
console.log(outsideOfBorders(s, numDivisions));
console.log(outsideOfBorders(n, numDivisions));
console.log(outsideOfBorders(b, numDivisions));
console.log(outsideOfBorders(h, numDivisions));
console.log('======');
console.log(outsideOfBorders(j, numDivisions));
console.log(outsideOfBorders(k, numDivisions));
console.log(outsideOfBorders(l, numDivisions));
console.log(outsideOfBorders(o, numDivisions));
*/


/* 
 TESTED
*/
function outsideOfBorders(segment, numOfDivisions) {
	var x = segment.getX();
	var y = segment.getY();
	var maxCoord = numOfDivisions - 1;
	return (x < 0 || y < 0 || x > maxCoord || y > maxCoord) ? true : false;
}

/*
*/
function createNextSegment(keystroke, x, y, col) {
	switch(keystroke) {
		case 1: x += -1;
				break;
		case 2: x += 1;
				break;
		case 3: y += -1;
				break;
		case 4: y += 1;
				break;
		default: return null;
	}
	return new SnakeSegment(x, y, col);
	}
}


function Snake(startSegment) {
	this.snake = [startSegment];
	
	this.length = function() { return this.snake.length; }
	this.getHeadX = function() { return this.snake[0].getX(); }
	this.getHeadY = function() { return this.snake[0].getY(); }
	
	this.updateSnake = function(newHead, growSnake) {
		this.snake.unshift(newHead);
		if(!growSnake) { this.snake.pop(); }
	}
	
	this.intersectsSnake = function(segment) {
		var x = segment.getX();
		var y = segment.getY();
		
		for(var i = 0; i < snake.length; i++) {
			var currSeg = this.snake[i];
			if(x === currSeg.getX() && y === currSeg.getY()) {
				return true;
			}
		}
		
		return false;
	}
	
	this.intersectHead = function(seg) {
		var h= this.snake[0];
		return (seg.getX() === h.getX() && seg.getY() === h.getY()) ? true : false;
	}
}

/* TESTED
*/
function SnakeSegment(x, y, color) {
	this.x = x;
	this.y = y;
	this.color = color;
	
	this.getX = function() { return this.x; }
	this.getY = function() { return this.y; }
	this.getColor = function() { return this.color; }
}


/* TESTED
*/
function drawSquare(canvas, squareSize, x, y, color1, color2) {
	var canvasCtx = canvas.getContext('2d');
	canvasCtx.fillStyle = color1;
	canvasCtx.fillRect((x * squareSize), (y * squareSize), squareSize, squareSize);
	
	canvasCtx.fillStyle = color2;
	canvasCtx.fillRect((x * squareSize) + 2, (y * squareSize) + 2, squareSize - 4, squareSize - 4);
}

/* TESTED
Creates a square canvas of the specified dimension
*/
function createBoard(dimension) {
	var canvas = document.createElement('canvas');
	canvas.width = canvas.height = dimension;
	return canvas;
}

/* TESTED
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

/* TESTED
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

/* TESTED
Error for internal logic. Thrown when the gameboard is not correct.
*/
function GameBoardError(msg) {
	this.msg = msg;
	this.name = 'GameBoardError';
	this.toString = function() {
		return this.name + ': ' + this.msg;
	}
}