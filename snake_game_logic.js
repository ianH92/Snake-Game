// Global constants
const numDivisions = 25; // Number of squares each row in the grid contains.
const minWidth = numDivisions * 4;
const maxWidth = numDivisions * 32;

var canvasParent = document.getElementById('gameboard');
var canvas = document.querySelector('canvas');

var windowWidth = window.innerWidth;
var width = calcWidth(windowWidth);

canvasParent.removeChild(canvas);
canvas = createBoard(width);
canvasParent.appendChild(canvas);

var ctx = canvas.getContext('2d');
var squareSize = canvas.width / numDivisions;
startScreen(ctx, canvas.width);

var scoreBox = document.getElementById('scoreboard');
scoreBox.style.width = canvas.width + 'px';

// Scorebox
var score = document.getElementById('score');
var numScore = 1;

window.addEventListener('resize', (event) => {
	windowWidth = window.innerWidth;
	width = calcWidth(windowWidth);
	
	canvasParent.removeChild(canvas);
	canvas = createBoard(width);
	canvasParent.appendChild(canvas);
	
	ctx = canvas.getContext('2d');
	squareSize = canvas.width / numDivisions;
	scoreBox.style.width = canvas.width + 'px';
	console.log('here');
});

var lastKey = 37;
window.addEventListener('keydown', (event) => { 
	lastKey = (event.keyCode > 36 && event.keyCode < 41) ? event.keyCode : lastKey; 
});

var play = false;
var intervalID = 0;
let snake = null;
canvas.addEventListener('click', function() {
	if(!play) {
		intervalID = playGame();
		play = true;
	}
});

function calcWidth(windowWidth) {
	let availWidth = Math.floor(windowWidth / numDivisions) * numDivisions;
	
	if(availWidth < minWidth) {
		return minWidth;
	} else if(availWidth > maxWidth) { 
		return maxWidth;
	} else {
		return availWidth;
	}
}

/**
 * Starts a new game.
 * @return {number} The id needed by clearInterval to stop setInterval.
 */
function playGame() {
	snake = new Snake(new Coordinates(12, 12), new Coordinates(12, 6));
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, width, width);
	return setInterval(function(){ gameLoop(snake, lastKey, ctx, width, squareSize, numDivisions); }, 100);
}

/**
 * Draws the start screen.
 *
 * @param {CanvasRenderingContext2D} ctx The canvas rendering context.
 */
function startScreen(ctx, width) {
	ctx.font = '25px monospace';
	ctx.fillStyle = 'gold';
	ctx.textAlign = 'center';
	ctx.fillText('Click Here to Play', width / 2 , width / 2);
}

/** 
 * Clears board and displays 'GAME OVER'. Stops the game.
 *
 * @param {CanvasRenderingContext2D} ctx The canvas rendering context.
 * @param {number} width The width of the canvas.
 */
function gameOver(ctx, width) {
	play = false;
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, width, width);
	
	ctx.font = '55px monospace';
	ctx.fillStyle = 'red';
	ctx.textAlign = 'center';
	ctx.fillText('GAME OVER', width / 2 , width / 2);
	
	ctx.font = '25px monospace';
	ctx.fillStyle = 'gold';
	ctx.fillText('Click to Play Again', width / 2, width / 1.5);
	
	score.textContent = 1;
	numScore = 1;
	
	clearInterval(intervalID);
}

/**
 * Returns a psuedorandom number in the range [0, max).
 *
 * @param {number} max The (exclusive) upper range.
 * @return {number} The pseudorandom number.
 */
function getRand(max) {
	return Math.floor(Math.random() * max);
}

/**
 * The game loop which runs the game logic; designed to run repeatedly by setInterval
 * 
 * @param {snake} Snake The object containing the snake properties and methods.
 * @param {number} lastKey The last valid key caught by the eventListener.
 * @param {CanvasRenderingContext2D} ctx The canvas rendering context.
 * @param {number} width The width of the canvas.
 * @param {number} squareSize The size of each element of the grid.
 * @param {number} numDivs The number of divisions in each row/column of the grid.
 */
function gameLoop(snake, lastKey, ctx, width, squareSize, numDivs) {
	let newHead = createNextSegment(lastKey, snake.getHeadX(), snake.getHeadY());
	
	if(outsideOfBorders(newHead, numDivs) || snake.intersectsSnake(newHead.getX(), newHead.getY())) {
		gameOver(ctx, width);
		return;
	}
	let grow = snake.headIntersectsFood();
	if(grow) { 
		numScore++;
		score.textContent = numScore;
		snake.createNewFood(numDivs); 
	}
	snake.updateSnake(newHead, grow);
	snake.drawSnake(ctx, squareSize);
	snake.drawFood(ctx, squareSize);
}

/**
 * Draws a square on the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx The canvas rendering context.
 * @param {number} squareSize The size of each element of the grid.
 * @param {number} x The x coordinate of the upper left corner.
 * @param {number} y The y coordinate of the upper left corner.
 * @param {String} col1 The border color of the square.
 * @param {String} col2 The internal color of the square.
 */
function drawSquare(ctx, squareSize, x, y, col1, col2) {
	ctx.fillStyle = col1;
	ctx.fillRect((x * squareSize), (y * squareSize), squareSize, squareSize);
	ctx.fillStyle = col2;
	ctx.fillRect((x * squareSize) + 2, (y * squareSize) + 2, squareSize - 4, squareSize - 4);
}

/**
 * Draws a white square on the canvas.
 *
 * @param {CanvasRenderingContext2D} ctx The canvas rendering context.
 * @param {number} squareSize The size of each element of the grid.
 * @param {number} x The x coordinate of the upper left corner.
 * @param {number} y The y coordinate of the upper left corner.
 */
function drawOverSquare(canvasCtx, squareSize, x, y) {
	canvasCtx.fillStyle = 'white';
	canvasCtx.fillRect((x * squareSize), (y * squareSize), squareSize, squareSize);
}

/**
 * Snake object which contains the coordinates of the snake segments and food.
 *
 * @constructor
 * @param {Coordinates} startSegment The starting coordinates of the head.
 * @param {Coordinates} startFood The starting coordinates of the food.
 */
function Snake(startSegment, startFood) {
	this.color1 = 'red'
	this.color2 = 'gold';
	
	this.snake = [startSegment];
	this.oldTail = null;
	this.food = startFood;
	
	/* Simple getter methods.
	 */
	this.length = function() { return this.snake.length; }
	this.getHead = function() { return this.snake[0]; }
	this.getHeadX = function() { return this.snake[0].getX(); }
	this.getHeadY = function() { return this.snake[0].getY(); }
	this.getSnake = function() { return this.snake; }
	
	/**
	 * Updates the snake by adding new head to queue and popping tail if snake did not grow.
	 *
	 * @param {Coordinates} newHead The coordinates of the new head.
	 * @param {boolean} growSnake A boolean designating if the snake grew.
	 */
	this.updateSnake = function(newHead, growSnake) {
		this.snake.unshift(newHead);
		if(!growSnake) { 
			this.oldTail = this.snake.pop();
		}
	}
	
	/**
	 * Checks if coordinates intersect any part of the snake.
	 *
	 * @param {number} x The x coordinate to check.
	 * @param {number} y The y coordinate to check.
	 * @return {boolean} true if intersects, false otherwise.
	 */
	this.intersectsSnake = function(x, y) {
		for(var i = 0; i < this.snake.length; i++) {
			var currSeg = this.snake[i];
			if(x === currSeg.getX() && y === currSeg.getY()) {
				return true;
			}
		}
		
		return false;
	}
	
	/**
	 * Check if the snakes head intersected the food.
	 *
	 * @return {boolean} true if the head intersected the food, false otherwise.
	 */
	this.headIntersectsFood = function() {
		var s= this.snake[0];
		return (this.food.getX() === s.getX() && this.food.getY() === s.getY());
	}
	
	/**
	 * Draw the snake on the board. Works by simply drawing the new head and if needed blanking out
	 * the old tail-end.
	 *
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context.
	 * @param {number} squareSize The size of each element of the grid.
	 */
	this.drawSnake = function(ctx, squareSize) {
		let s = this.snake[0];
		drawSquare(ctx, squareSize, s.getX(), s.getY(), this.color1, this.color2);
		
		s = this.oldTail;
		if(s !== null) {
			drawOverSquare(ctx, squareSize, s.getX(), s.getY());
		}
	}
	
	/**
	 * Convenience method to draw the food. Same thing as drawSqaure().
	 *
	 * @param {CanvasRenderingContext2D} ctx The canvas rendering context.
	 * @param {number} squareSize The size of each element of the grid.
	 */
	this.drawFood = function(ctx, squareSize) {
		drawSquare(ctx, squareSize, this.food.getX(), this.food.getY(), this.color1, this.color2);
	}
	
	/**
	 * Generates the coordinates for the new food randomly. Coordinates won't intersect the snake.
	 *
	 * @param {number} numDivisions The number of divisions in each row/column of the grid.
	 * @return {Coordinates} The coordinates of the new food.
	 */
	this.createNewFood = function(numDivisions) {
		let x = getRand(numDivisions);
		let y = getRand(numDivisions);
		
		while(this.intersectsSnake(x, y)) {
			x = getRand(numDivisions);
			y = getRand(numDivisions);
		}
		this.food = new Coordinates(x, y);
	}
}

/**
 * Checks if coordinates are outside allowed borders.
 *
 * @param {Coordinates} segment The coordinates to check.
 * @param {number} numOfDivisons The number of divisions in each row/column of the grid.
 * @return {boolean} true if coordinates are outside of borders, false otherwise.
 */
function outsideOfBorders(segment, numOfDivisions) {
	var x = segment.getX();
	var y = segment.getY();
	var maxCoord = numOfDivisions - 1;
	return (x < 0 || y < 0 || x > maxCoord || y > maxCoord) ? true : false;
}

/**
 * Creates the next head of the snake based on keyboard input. 
 *
 * @param {number} keystroke The last valid keystroke entered by the user.
 * @param {number} x The x coordinate of the current head.
 * @param {number} y The y coordinate of the current head.
 * @return {Coordinates} The coordinates of the new head.
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

/**
 * Coordinates object hold simple cartesian coordinates.
 *
 * @constructor
 * @param {number} x The x coordinate.
 * @param {number} y The y coordinate.
 */
function Coordinates(x, y) {
	this.x = x;
	this.y = y;
	
	// Simple getter methods.
	this.getX = function() { return this.x; }
	this.getY = function() { return this.y; }
}

/**
 * Creates a square canvas of the specified dimensions.
 *
 * @param {number} dimension The length and width of the canvas.
 * @return {Canvas} The canvas.
 */
function createBoard(dimension) {
	var canvas = document.createElement('canvas');
	canvas.width = canvas.height = dimension;
	return canvas;
}

/**
 * Checks to ensure the canvas meets three conditions:
 * 1-canvas must be square (width = height)
 * 2-canvas must be divisible by numDivisions (always set to 25)
 * 3-canvas must be >= minWidth x minWidth and <= maxWidth x maxWidth
 *
 * @throws GameBoardError.
 * @param {Canvas} canvas The canvas to check.
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

/**
 * Error message for debugging
 *
 * @param {String} msg The error message.
 */
function GameBoardError(msg) {
	this.msg = msg;
	this.name = 'GameBoardError';
	this.toString = function() {
		return this.name + ': ' + this.msg;
	}
}