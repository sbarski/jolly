"use strict";

/*
 * Applications
 */ 
var board = null; 

var boardWidth = 0;
var boardHeight = 0;
var offsety = 0;
var offsetx = 0;

var curx = 0;
var cury = 0;
var simulationSteps = 0;

var tickSpeed = 100;
var tickIteration = 0;
var tickInterval = null;

var oldLifePosition = [];

var isSimulationRunning = false;

function initHashlife(kBoardWidth, kBoardHeight)
{
	board = new LifeBoard();

	boardWidth = kBoardWidth;
	boardHeight = kBoardHeight;
	
	offsety = 0;//-boardHeight / 2;
	offsetx = 0;//-boardWidth / 2;
	
	curx = cury = steps = 0;
	drawGrid();
}

function runHashlife()
{
	isSimulationRunning = !isSimulationRunning;
	
	if (!isSimulationRunning)
	{
		if (tickInterval !== null)
			clearInterval(tickInterval);
			
		simulationSteps = 0;
		document.getElementById("runButton").innerHTML = "Start Simulation";
	}
	else
	{	
		document.getElementById("runButton").innerHTML = "Stop Simulation";
	
		tickInterval = setInterval(function () {
			step(1);
		}, tickSpeed);
	}
}

function visibleRect()
{
	return new rect(offsetx, offsety, offsetx + boardWidth, offsety + boardHeight);
}

function redraw()
{
	//Update the drawing here
	//drawGrid();
	
	var cells = board.getAll(visibleRect());
	
	gDrawingContext.fillStyle = gBoardColour;
	for (var i = 0; i < oldLifePosition.length; i++)
	{
		var x = oldLifePosition[i].x;
		var y = oldLifePosition[i].y;
		
		gDrawingContext.fillRect(x*kPieceWidth+1, y*kPieceHeight+1, kPieceWidth-1, kPieceHeight-1);
	}
	
	oldLifePosition = [];

	gDrawingContext.fillStyle = gSelectedColour;
	for (var position = 0; position < cells.length; position++)
	{
		var x = cells[position][0]
		var y = cells[position][1];
		
		gDrawingContext.fillRect(x*kPieceWidth+1, y*kPieceHeight+1, kPieceWidth-1, kPieceHeight-1);	

		oldLifePosition.push(new rect(x,y,0,0));
	}
	
	document.getElementById("steps").innerHTML = "Steps: " + simulationSteps;
}

function update(x, y)
{
    if (curx >= offsetx && curx < offsetx + boardWidth && cury >= offsety && cury < offsety + boardHeight)
	{
		if (board.get(x, y))
		{
			oldLifePosition.push(new rect(x,y,0,0));
		
			gDrawingContext.fillStyle = gSelectedColour;
			gDrawingContext.fillRect(x*kPieceWidth+1, y*kPieceHeight+1, kPieceWidth-1, kPieceHeight-1);
		}
		else
		{
			gDrawingContext.fillStyle = gBoardColour;
			gDrawingContext.fillRect(x*kPieceWidth+1, y*kPieceHeight+1, kPieceWidth-1, kPieceHeight-1);
		}
	}
}

function toggle(curx, cury)
{

    var value = 1 - this.board.get(curx, cury);
	//console.log("toggle" + ", " + value);
    
	board.set(curx, cury, value);
	//console.log("end toggle");
    update(curx, cury);
    // var value = 1 - this.board.get(curx+this.board._originx, cury+this.board._originy);
    
	// board.set(curx+this.board._originx, cury+this.board._originy, value);
    // update(curx+this.board._originx, cury+this.board._originy);
}


function clickOnCell(position)
{
	//var node = root.addLeafNode(position.x, position.y, kMinSize);
	toggle(position.row, position.column);
	
	//drawCanvas();
}

function step(steps)
{
    if (board.root().width() > Math.pow(2,28)) 
		collect();
		
    board.step(steps);
    simulationSteps += steps;
    redraw();
}

function bigstep()
{
    if (self.steps == 0)
		step(1);
    else
		step(self.steps);
}

function keepcentered()
{
    maxx = self.curx - self.width / 4;
	maxy =  self.cury - self.height / 4;
    
	minx = maxx - self.width / 2;
	miny = maxy - self.height / 2;
	
    offsetx = min(maxx, max(minx, offsetx));
    offsety = min(maxy, max(miny, offsety));
	
    if (offsetx != offsetx || offsety != offsety)
	{
      offsetx = offsetx;
	  offsety = offsety;
      self.redraw();
	}
}

function clear()
{
    board.clear();
    steps = 0;
    redraw();
}

function collect()
{
    board.collect();
    redraw();
}

function find()
{
    cells = board.getAll();
    if (len(cells) > 0)
	{
      self.curx = self.cury = cells[0];
      keepcentered();
	}
}

/*
 * Auxillary functions 
 */
function drawGrid()
{
	gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);
	
	gDrawingContext.fillStyle = gBoardColour;
	gDrawingContext.fillRect(0, 0, kPixelWidth, kPixelHeight);
	
	gDrawingContext.fillStyle = gSelectedColour;
	gDrawingContext.strokeStyle = gBorderColour;

	/* vertical lines */
    for (var x = offsetx; x <= kPixelWidth; x += kPieceWidth) {
		gDrawingContext.moveTo(0.5 + x, 0);
		gDrawingContext.lineTo(0.5 + x, kPixelHeight);
    }
    
    /* horizontal lines */
    for (var y = offsety; y <= kPixelHeight; y += kPieceHeight) {
		gDrawingContext.moveTo(0, 0.5 + y);
		gDrawingContext.lineTo(kPixelWidth, 0.5 +  y);
    }
    
    /* draw it! */
    gDrawingContext.strokeStyle = gGridColour;
    gDrawingContext.stroke();
}

function rect(x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}