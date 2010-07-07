"use strict";

/*
 * Applications
 */ 
function LifeGame(boardWidth, boardHeight, drawingContext)
{
	var board = new LifeBoard();

	var boardWidth = boardWidth;
	var boardHeight = boardHeight;
	var drawingContext = drawingContext;
	
	var simulationSteps = 0;
	
	var isSimulationRunning = false;
	
	var oldLifePosition = [];
	
	var offsety = 0;
	var offsetx = 0;
	
	var curx = 0;
	var cury = 0
	
	var tickSpeed = 100;
	var tickIteration = 0;
	var tickInterval = null;
	
	//a purely decorative trail
	//var showTrail = true; 
	//var trailPosition = [];
	
	drawGrid();
	
	/* Private: visibleRect */
	function visibleRect(){
		return new Rect(offsetx, offsety, offsetx + boardWidth, offsety + boardHeight);
	};
	
	/* Private: redraw */
	function redraw(){
		//Update the drawing here
		var cells = board.getAll(visibleRect());
	
		// if (showTrail){
			// gDrawingContext.fillStyle  = gTrailColour;
		// }
		// else{
			gDrawingContext.fillStyle = gBoardColour;
		//}
		
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

			oldLifePosition.push(new Rect(x,y,0,0));
		}
	
		document.getElementById("steps").innerHTML = "Steps: " + simulationSteps;
	};
	
	function update(x, y){
		if (curx >= offsetx && curx < offsetx + boardWidth && cury >= offsety && cury < offsety + boardHeight)
		{
			if (board.get(x, y))
			{
				oldLifePosition.push(new Rect(x,y,0,0));
			
				gDrawingContext.fillStyle = gSelectedColour;
				gDrawingContext.fillRect(x*kPieceWidth+1, y*kPieceHeight+1, kPieceWidth-1, kPieceHeight-1);
			}
			else
			{
				gDrawingContext.fillStyle = gBoardColour;
				gDrawingContext.fillRect(x*kPieceWidth+1, y*kPieceHeight+1, kPieceWidth-1, kPieceHeight-1);
			}
		}
	};
	
	
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
	};
	
	/* Privildged Methods */
	this.run = function(){
		if (!isSimulationRunning)
		{
			isSimulationRunning = true;
			
			tickInterval = setInterval(function () {
				step(1);
			}, tickSpeed);
		}
	};

	this.stop = function(){
		isSimulationRunning = false;
		
		if (tickInterval !== null)
			clearInterval(tickInterval);
	};

	this.clear = function(){
		isSimulationRunning = false;
		
		if (tickInterval !== null)
			clearInterval(tickInterval);
			
		simulationSteps = 0;
			
		board.clear();
		redraw();
	};

	this.toggle = function(curx, cury){
		var value = 1 - board.get(curx, cury);
		
		board.set(curx, cury, value);
		update(curx, cury);
	}


	this.step = function(steps){
		if (board.root().width() > Math.pow(2,28)) 
			board.collect();
			
		board.step(steps);
		simulationSteps += steps;

		redraw();
	};
	
	/* For Testing */
	this.board = function(){
		return board;
	};
	
	this.getVisibleRect = function(){
		return visibleRect();
	};
}

