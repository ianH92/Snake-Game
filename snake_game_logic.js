// Global constants
const numDivisions = 25;
const minWidth = numDivisions * 1;
const maxWidth = numDivisions * 40;

var canvas = document.querySelector('canvas');
checkCanvas(canvas);


/*
Checks to ensure the canvas meets three conditions:
1-canvas must be square (width = height)
2-canvas must be divisible by numDivisions (always set to 25)
3-canvas must be less than or equal to 25x25 and greater than or equal to 1000x1000
*/
function checkCanvas(canvas) {
	var width = canvas.width;
	var height = canvas.height;
	
	// Canvas must be square, divisible by numDivisions, and between 25x25 to 1000x1000
	if(width !== height) {
		console.log('here');
		throw new GameBoardError('canvas must be sqaure. Currently: ' + width + 'x' + height + '.');
		console.log('here again');
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

function GameBoardError(msg) {
	this.msg = msg;
	this.name = 'GameBoardError';
	this.toString = function() {
		return this.name + ': ' + this.msg;
	}
}

/*
function createCanvas(widthAndHeight, numDivisions, color1, color2) {
	// Create a new canvas of dimensions widthAndHeight X widthAndHeight
	var newCanvas = document.createElement('canvas');
	newCanvas.width = newCanvas.height = widthAndHeight;
	
	// Draw a checkerboard on the canvas
	var canvasCtx = newCanvas.getContext('2d');
	var square = (wdithAndHeight / numDivisions);
	for(var i = 0; i < witdthAndHeight; i += square) {
		canvasCtx.moveTo(i, i);
		canvas.fillRect(i, i, square, square);
	}
}
*/