var gCanvasElement = null;
var gDrawingContext = null;

var lifeGame = null;

var gBoardColour = "#ccc";
var gBorderColour = "#000";
var gGridColour = "#FFFF99";
var gSelectedColour = "#000000";
var gTrailColour = "#9900FF";

var kBoardWidth = 10;
var kBoardHeight = 10;

var kPieceWidth = 25;
var kPieceHeight= 25;

var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
var kPixelHeight= 1 + (kBoardHeight * kPieceHeight);

var isInternetExplorer = false;

/*
 *	Initialise the canvas for graphics display
 */
function initEngine(canvasElement)
{
	if (canvasElement == null)
	{
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
	}
	
	//setCanvasDimensions();
	
	gCanvasElement = canvasElement;
	gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;
	
	gDrawingContext = gCanvasElement.getContext("2d");
	
	/*
	 * IE handles click events differently to other browsers
	 * http://www.xml.com/lpt/a/1656
	 */
	if (gCanvasElement.addEventListener) {
        gCanvasElement.addEventListener("click", onMouseClick, false);
    } else if (gCanvasElement.attachEvent) {
        gCanvasElement.attachEvent("onclick", onMouseClick);
    } else {
        alert("Your browser will not work for this example.");
    }
	
	lifeGame = new LifeGame(kBoardWidth, kBoardHeight, gDrawingContext);
}

/*
 * We shall set default canvas dimensions based on the horizontal and vertical resolution of the monitor
 */
function setCanvasDimensions()
{

	kBoardWidth = Math.floor(viewport().width / kPieceWidth);
	kBoardHeight = Math.floor(viewport().height / kPieceHeight);
	
	//kPieceWidth = Math.floor(document.body.clientWidth / kBoardWidth);
	//kPieceHeight = Math.floor(document.body.clientHeight / kBoardHeight);
	
	kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
	kPixelHeight= 1 + (kBoardHeight * kPieceHeight);
}

//http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
function viewport() {
var h = document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
var w = document.getElementsByTagName('body')[0].clientWidth;

return { width : w , height : h }
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
    
	x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
	
    x = Math.min(x, kBoardWidth * kPieceWidth);
    y = Math.min(y, kBoardHeight * kPieceHeight);
    
	var rect = new Rect(Math.floor(x/kPieceHeight),Math.floor(y/kPieceWidth));

	return rect;

}

function step()
{
	lifeGame.step(1);
}

function run()
{
	lifeGame.run();
}

function stop()
{
	lifeGame.stop();
}

function clear()
{
	lifeGame.clear();
}

/*
 *  Stores the cell row and column that the user clicked on
 */
function Rect(x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}
