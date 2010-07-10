"use strict";

/*
 * Applications
 */ 
function LifeGame()
{
	var that = this;
	var board = new LifeBoard();
	
	var fileSystem = new FileSystem();

	// var boardWidth = boardWidth;
	// var boardHeight = boardHeight;
	// var drawingContext = drawingContext;
	
	var simulationSteps = 0;
	
	var isSimulationRunning = false;
	
	var oldLifePosition = [];
	
	var offsety = 0;
	var offsetx = 0;
	
	var curx = 0;
	var cury = 0;
	
	var tickSpeed = 100;
	var tickInterval = null;
	
	var showGrid = true;
	
	//a purely decorative trail
	//var showTrail = true; 
	//var trailPosition = [];
	
	drawGrid();
	
	/* Private: visibleRect */
	function visibleRect(){
		return new Rect(offsetx, offsety, offsetx + data.boardWidth, offsety + data.boardHeight);
	}
	
	/* Private: redraw */
	function redraw(){
	
		//Update the drawing here
		var cells = board.getAll(visibleRect());
	
		// if (showTrail){
			// data.drawingContext.fillStyle  = gTrailColour;
		// }
		// else{
			data.drawingContext.fillStyle = data.boardColour;
		//}
		
		for (var i = 0; i < oldLifePosition.length; i++)
		{
			var x = oldLifePosition[i].x;
			var y = oldLifePosition[i].y;
		
			data.drawingContext.fillRect(x*data.pieceWidth+1, y*data.pieceHeight+1, data.pieceWidth-1, data.pieceHeight-1);
		}
	
		oldLifePosition = [];

		data.drawingContext.fillStyle = data.selectedColour;
		for (var position = 0; position < cells.length; position++)
		{
			var x = cells[position][0]
			var y = cells[position][1];
		
			data.drawingContext.fillRect(x*data.pieceWidth+1, y*data.pieceHeight+1, data.pieceWidth-1, data.pieceHeight-1);	

			oldLifePosition.push(new Rect(x,y,0,0));
		}
	
		document.getElementById("steps").innerHTML = "Steps: " + simulationSteps;
	}
	
	function update(x, y){
		if (curx >= offsetx && curx < offsetx + data.boardWidth && cury >= offsety && cury < offsety + data.boardHeight)
		{
			if (board.get(x, y))
			{
				oldLifePosition.push(new Rect(x,y,0,0));
			
				data.drawingContext.fillStyle = data.selectedColour;
				data.drawingContext.fillRect(x*data.pieceWidth+1, y*data.pieceHeight+1, data.pieceWidth-1, data.pieceHeight-1);
			}
			else
			{
				data.drawingContext.fillStyle = data.boardColour;
				data.drawingContext.fillRect(x*data.pieceWidth+1, y*data.pieceHeight+1, data.pieceWidth-1, data.pieceHeight-1);
			}
		}
	}
	
	
	/*
	 * Auxillary functions 
	 */
	function drawGrid()
	{
		
		data.drawingContext.clearRect(0, 0, data.pixelWidth(), data.pixelHeight());

		data.drawingContext.save();
		
		data.drawingContext.fillStyle = data.boardColour;
		data.drawingContext.fillRect(0, 0, data.pixelWidth(), data.pixelHeight());
		
		data.drawingContext.fillStyle = data.selectedColour;
		data.drawingContext.strokeStyle = data.borderColour;
		
		data.drawingContext.beginPath();
		/* vertical lines */
		for (var x = offsetx; x <= data.pixelWidth(); x += data.pieceWidth) {
			data.drawingContext.moveTo(0.5 + x, 0);
			data.drawingContext.lineTo(0.5 + x, data.pixelHeight());
		}
		
		/* horizontal lines */
		for (var y = offsety; y <= data.pixelHeight(); y += data.pieceHeight) {
			data.drawingContext.moveTo(0, 0.5 + y);
			data.drawingContext.lineTo(data.pixelWidth(), 0.5 +  y);
		}
		
		data.drawingContext.closePath();

		/* draw it! */
		data.drawingContext.strokeStyle = data.gridColour;
		data.drawingContext.stroke();
		
		data.drawingContext.restore();
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
		
		if (tickInterval !== null){
			clearInterval(tickInterval);
		}
	};

	this.clear = function(){
		isSimulationRunning = false;
		
		if (tickInterval !== null){
			clearInterval(tickInterval);
		}
			
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
		steps = parseInt(steps);
		
		if (steps <= 0){
			return;
		}
	
		if (board.root().width() > Math.pow(2,28)) {
			board.collect();
		}
			
		board.step(steps);
		simulationSteps += steps;

		redraw();
	};
	
	this.zoom = function(level){
		drawGrid();
		redraw();
	};
	
	this.load = function(event){
		var result = fileSystem.handleFileSelect(event);
	};
	
	this.loadData = function(data){
		this.clear();
		
		for (var i = 0; i < data.length; i++)
		{
			var curx = data[i][0];
			var cury = data[i][1];
		
			var value = 1 - board.get(curx, cury);
		
			board.set(curx, cury, value);
		}
		
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

