// Global constants
const numDivisions = 25; // Number of squares each row in the grid contains.
const minWidth = numDivisions * 4;
const maxWidth = numDivisions * 40;

// Colors for board and snake
const col1 = 'red';
const col2 = 'gold';
const col3 = 'white';
const col4 = 'lightgray';

var canvas = document.querySelector('canvas');
var width = canvas.width;
var squareSize = width / numDivisions;
var ctx = canvas.getContext('2d');
drawGameBoardGrid(ctx, width, squareSize, col3, col4);

var lastKey = 37;
window.addEventListener('keydown', (event) => { lastKey = event.keyCode; });


let snake = new Snake(new SnakeSegment(12, 12, col1, col2));
let food = new Food();
food.createNewFood(numDivisions, col1, col2, snake);
//setInterval(function(){ gameLoop(snake, food, lastKey, ctx, width, squareSize, col1, col2, col3, col4); }, 100);


/* TESTED
*/
function Food() {
	this.food = null
	
	this.getFood = function() { return this.food; }
	this.createNewFood = function(numDivisions, col1, col2, snake) {
		let x = getRand(numDivisions);
		let y = getRand(numDivisions);
		
		while(snake.intersectsSnake(x, y)) {
			x = getRand(numDivisions);
			y = getRand(numDivisions);
		}
		this.food = new SnakeSegment(x, y, col1, col2);
	}
}



/* TESTED
*/
function getRand(max) {
	return Math.floor(Math.random() * max);
}







function gameLoop(snake, food, lastKey, ctx, width, squareSize, col1, col2, col3, col4) {
	let newHead = createNextSegment(lastKey, snake.getHeadX(), snake.getHeadY(), col1, col2);
	let currFood = food.getFood();
	let grow = (snake.intersectHead(currFood)) ? true : false;
	if(grow) { food.createNewFood(numDivisions, col1, col2, snake); }
	
	snake.updateSnake(newHead, grow);
	drawGameBoardGrid(ctx, width, squareSize, col3, col4);
	drawSnake(ctx, squareSize, snake.getSnake());
	drawSquare(ctx, squareSize, food.getFood().getX(), food.getFood().getY(), col1, col2);
}


/* TESTED
*/
function drawSnake(canvasCtx, squareSize, snake) {
	for(var i = 0; i < snake.length; i++) {
		var s = snake[i];
		drawSquare(canvasCtx, squareSize, s.getX(), s.getY(), s.getColor1(), s.getColor2());
	}
}

/* TESTED
*/
function drawSquare(canvasCtx, squareSize, x, y, color1, color2) {
	canvasCtx.fillStyle = color1;
	canvasCtx.fillRect((x * squareSize), (y * squareSize), squareSize, squareSize);
	canvasCtx.fillStyle = color2;
	canvasCtx.fillRect((x * squareSize) + 2, (y * squareSize) + 2, squareSize - 4, squareSize - 4);
}

/* TESTED
*/
function Snake(startSegment) {
	this.snake = [startSegment];
	
	this.length = function() { return this.snake.length; }
	this.getHead = function() { return this.snake[0]; }
	this.getHeadX = function() { return this.snake[0].getX(); }
	this.getHeadY = function() { return this.snake[0].getY(); }
	this.getSnake = function() { return this.snake; }
	
	this.updateSnake = function(newHead, growSnake) {
		this.snake.unshift(newHead);
		if(!growSnake) { this.snake.pop(); }
	}
	
	this.intersectsSnake = function(x, y) {
		for(var i = 0; i < this.snake.length; i++) {
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
function outsideOfBorders(segment, numOfDivisions) {
	var x = segment.getX();
	var y = segment.getY();
	var maxCoord = numOfDivisions - 1;
	return (x < 0 || y < 0 || x > maxCoord || y > maxCoord) ? true : false;
}

/* TESTED
*/
function createNextSegment(keystroke, x, y, col1, col2) {
	switch(keystroke) {
		case 37: x += -1; //left
				break;
		case 38: y += -1; //up
				break;
		case 39: x += 1; //right
				break;
		case 40: y += 1; //down
				break;
		default: return null;
	}
	return new SnakeSegment(x, y, col1, col2);
}

/* TESTED
*/
function SnakeSegment(x, y, color1, color2) {
	this.x = x;
	this.y = y;
	this.color1 = color1;
	this.color2 = color2;
	
	this.getX = function() { return this.x; }
	this.getY = function() { return this.y; }
	this.getColor1 = function() { return this.color1; }
	this.getColor2 = function() { return this.color2; }
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
function drawGameBoardGrid(canvasCtx, width, squareSize, color1, color2) {
	var c = 0;
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