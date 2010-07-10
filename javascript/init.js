var data = {
	//return {
		/* Drawing */
		canvasElement : null,
		drawingContext : null,
		
		/* File Processing */
		fileSystem : null,

		/* Cosmetics */
		boardColour : "#ccc",
		borderColour : "#000",
		gridColour : "#FFFF99",
		selectedColour : "#000000",
		trailColour : "#9900FF",

		/* Canvas Dimensions */
		boardWidth : 1600,
		boardHeight : 800,

		pieceWidth : 40,
		pieceHeight : 40,

		isInternetExplorer : false,
		
		pixelWidth: function(){
			return 1 + this.boardWidth;
		},
			
		pixelHeight: function(){
			return 1 + this.boardHeight;
		}
};

/* The game of life! */
var lifeGame = null;
var canvasElement = null;

/*
 *	Initialise the canvas for graphics, mouse and create the game
 */
function initEngine()
{
	/* Create and Init canvas */
	canvasElement = document.createElement("canvas");
	canvasElement.id = "lifegame_canvas";
	document.getElementById("canvasSpace").appendChild(canvasElement);
		
	/*
	* If canvas is created on the fly with javascript in IE it will be imposible to get its context
	* Therefore we need to do some magic to instantiate the element
	 * http://groups.google.com/group/google-excanvas/browse_thread/thread/b73e8820a43344e0
	 */
	if (typeof window.G_vmlCanvasManager != "undefined") { 
		//a friendlier way to check to see if we're in IE emulating Canvas
		canvasElement = window.G_vmlCanvasManager.initElement(canvasElement);
		isInternetExplorer = true;
	} 
	
	/* Set the dimensions of the canvas */
	setCanvasDimensions();
	
	data.canvasElement = canvasElement;
	data.canvasElement.width = data.boardWidth;
    data.canvasElement.height = data.boardHeight;
	
	data.drawingContext = canvasElement.getContext("2d");
	
	/*
	 * IE handles click events differently to other browsers
	 * http://www.xml.com/lpt/a/1656
	 */
	if (data.canvasElement.addEventListener) {
        data.canvasElement.addEventListener("click", onMouseClick, false);
    } else if (data.canvasElement.attachEvent) {
        data.canvasElement.attachEvent("onclick", onMouseClick);
    } else {
        alert("Your browser will not work for this example.");
    }

	data.fileSystem = new FileSystem();
	
	document.getElementById("file").addEventListener("change", data.fileSystem.handleFileSelect, false);

	lifeGame = new LifeGame();
}

/*
 * We shall set default canvas dimensions based on the horizontal and vertical resolution of the monitor
 */
function setCanvasDimensions()
{
	
	//data.boardWidth = Math.floor(viewport().width / data.pieceWidth);
	//data.boardHeight = Math.floor(viewport().height / data.pieceHeight);
	
	//data.pieceWidth = Math.floor(document.body.clientWidth / data.boardWidth);
	//data.pieceHeight = Math.floor(document.body.clientHeight / data.boardHeight);
	
	//kPixelWidth = 1 + (Math.floor(data.boardWidth) * data.pieceWidth);
	//kPixelHeight= 1 + (Math.floor(data.boardHeight	) * data.pieceHeight);
}

//http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
function viewport() {
	var h = document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
	var w = document.getElementsByTagName('body')[0].clientWidth;

	return { width : 1200 , height : 600 }
}

/*
 *	Handles mouse clicks on the canvas
 */
function onMouseClick(e)
{
	var rect = getCursorPosition(e);
	
	lifeGame.toggle(rect.x, rect.y);
}

/*
 *  Returns cursor position in relative coordinates to the canvas -> translated from world coordinates
 */
function getCursorPosition(e)
{
	/* returns Cell with .row and .column properties */
    var x;
    var y;
	
	if (e.pageX || e.pageY) {
		x = e.pageX;
		y = e.pageY;
    }
    else {
		x = e.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
		y = e.clientY + document.documentElement.scrollTop + document.body.scrollTop;
    }
    
	x -= data.canvasElement.offsetLeft;
    y -= data.canvasElement.offsetTop;
	
    x = Math.min(x, data.boardWidth * data.pieceWidth);
    y = Math.min(y, data.boardHeight * data.pieceHeight);
    
	var rect = new Rect(Math.floor(x/data.pieceHeight),Math.floor(y/data.pieceWidth));

	return rect;

}

function step(){
	lifeGame.step(1);
}

function run(){
	lifeGame.run();
}

function stop(){
	lifeGame.stop();
}

function clear(){
	lifeGame.clear();
}

function zoom(level){
	if (level == 0)
	{	
		data.pieceWidth = 20;
		data.pieceHeight = 20;
	}
	else if (level > 0 && (data.pieceWidth < 80 && data.pieceHeight < 80))
	{
		data.pieceWidth *= 2;
		data.pieceHeight *= 2;
	}
	else if (level < 0 && (data.pieceWidth > 5 && data.pieceHeight > 5))
	{
		data.pieceWidth /= 2;
		data.pieceHeight /= 2;
	}
	
	setCanvasDimensions();

	lifeGame.zoom(level);
}

/*
 *  Stores the cell row and column that the user clicked on
 */
function Rect(x, y, width, height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}
