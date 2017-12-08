// Global constants
const numDivisions = 25; // Number of squares each row in the grid contains.
const minWidth = numDivisions * 4;
const maxWidth = numDivisions * 40;

var canvas = document.querySelector('canvas');
var width = canvas.width;
var squareSize = width / numDivisions;
var ctx = canvas.getContext('2d');

var lastKey = 37;
window.addEventListener('keydown', (event) => { 
	lastKey = (event.keyCode > 36 && event.keyCode < 41) ? event.keyCode : lastKey; 
});

let snake = new Snake(new Coordinates(12, 12), new Coordinates(12, 6));
var intervalID = setInterval(function(){ gameLoop(snake, lastKey, ctx, width, squareSize, numDivisions); }, 100);

function gameOver(ctx, width) {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, width, width);
	
	ctx.font = '55px monospace';
	ctx.fillStyle = 'red';
	ctx.fillText('GAME OVER', width / 5 , width / 2);
	clearInterval(intervalID);
}

/* TESTED
*/
function getRand(max) {
	return Math.floor(Math.random() * max);
}

function gameLoop(snake, lastKey, ctx, width, squareSize, numDivs) {
	let newHead = createNextSegment(lastKey, snake.getHeadX(), snake.getHeadY());
	
	if(outsideOfBorders(newHead, numDivs) || snake.intersectsSnake(newHead.getX(), newHead.getY())) {
		gameOver(ctx, width);
		return;
	}
	let grow = snake.headIntersectsFood();
	if(grow) { 
		snake.createNewFood(numDivs); 
	}
	snake.updateSnake(newHead, grow);
	snake.drawSnake(ctx, squareSize);
	snake.drawFood(ctx, squareSize);
}

/* TESTED
*/
function drawSquare(canvasCtx, squareSize, x, y, col1, col2) {
	canvasCtx.fillStyle = col1;
	canvasCtx.fillRect((x * squareSize), (y * squareSize), squareSize, squareSize);
	canvasCtx.fillStyle = col2;
	canvasCtx.fillRect((x * squareSize) + 2, (y * squareSize) + 2, squareSize - 4, squareSize - 4);
}

/* TESTED
*/
function drawOverSquare(canvasCtx, squareSize, x, y) {
	canvasCtx.fillStyle = 'white';
	canvasCtx.fillRect((x * squareSize), (y * squareSize), squareSize, squareSize);
}

/* TESTED
*/
function Snake(startSegment, startFood) {
	this.color1 = 'red'
	this.color2 = 'gold';
	
	this.snake = [startSegment];
	this.oldTail = null;
	this.food = startFood;
	
	this.length = function() { return this.snake.length; }
	this.getHead = function() { return this.snake[0]; }
	this.getHeadX = function() { return this.snake[0].getX(); }
	this.getHeadY = function() { return this.snake[0].getY(); }
	this.getSnake = function() { return this.snake; }
	
	/* TESTED */
	this.updateSnake = function(newHead, growSnake) {
		this.snake.unshift(newHead);
		if(!growSnake) { 
			this.oldTail = this.snake.pop();
		}
	}
	
	/* TESTED */
	this.intersectsSnake = function(x, y) {
		for(var i = 0; i < this.snake.length; i++) {
			var currSeg = this.snake[i];
			if(x === currSeg.getX() && y === currSeg.getY()) {
				return true;
			}
		}
		
		return false;
	}
	
	/* TESTED */
	this.headIntersectsFood = function() {
		var s= this.snake[0];
		return (this.food.getX() === s.getX() && this.food.getY() === s.getY());
	}
	
	/* TESTED - only need to draw the new head and if necessary overdraw old tail
	*/
	this.drawSnake = function(ctx, gridElementLen) {
		let s = this.snake[0];
		drawSquare(ctx, gridElementLen, s.getX(), s.getY(), this.color1, this.color2);
		
		s = this.oldTail;
		if(s !== null) {
			drawOverSquare(ctx, gridElementLen, s.getX(), s.getY());
		}
	}
	
	this.drawFood = function(ctx, squareSize) {
		drawSquare(ctx, squareSize, this.food.getX(), this.food.getY(), this.color1, this.color2);
	}
	
	/* TESTED */
	this.createNewFood = function(numDivisions) {
		let x = getRand(numDivisions);
		let y = getRand(numDivisions);
		console.log('x = ' + x);
		console.log('y = ' + y);
		while(this.intersectsSnake(x, y)) {
			x = getRand(numDivisions);
			y = getRand(numDivisions);
		}
		this.food = new Coordinates(x, y);
		console.log('food x = ' + this.food.getX());
		console.log('food y = ' + this.food.getY());
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
function createNextSegment(keystroke, x, y) {
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
	return new Coordinates(x, y);
}

/* TESTED
*/
function Coordinates(x, y) {
	this.x = x;
	this.y = y;
	
	this.getX = function() { return this.x; }
	this.getY = function() { return this.y; }
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