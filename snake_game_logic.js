

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



function drawSquare(canvas, squareSize, x, y, color1, color2) {
	var canvasCtx = canvas.getContext('2d');
	canvasCtx.fillStyle = color1;
	canvasCtx.fillRect((x * squareSize), (y * squareSize), squareSize, squareSize);
	
	canvasCtx.fillStyle = color2;
	canvasCtx.fillRect((x * squareSize) + 2, (y * squareSize) + 2, squareSize - 4, squareSize - 4);
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