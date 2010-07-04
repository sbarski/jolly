var gCanvasElement = null;
var gDrawingContext = null;

var gBoardColour = "#ccc";
var gBorderColour = "#000";
var gGridColour = "#FFFF99";
var gSelecedColour = "#000000";

var kBoardWidth = 40;
var kBoardHeight = 40;

var kPieceWidth = 40;
var kPieceHeight= 40;

var kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
var kPixelHeight= 1 + (kBoardHeight * kPieceHeight);

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
            canvasElement=window.G_vmlCanvasManager.initElement(canvasElement);
		} 
	}
	
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
	
	initHashlife(kBoardWidth, kBoardHeight);
}

/*
 * We shall set default canvas dimensions based on the horizontal and vertical resolution of the monitor
 */
function setCanvasDimensions()
{
	kPieceWidth = Math.floor(document.body.clientWidth / kBoardWidth);
	kPieceHeight = Math.floor(document.body.clientHeight / kBoardHeight);
	
	kPixelWidth = 1 + (kBoardWidth * kPieceWidth);
	kPixelHeight= 1 + (kBoardHeight * kPieceHeight);
}

/*
 *	Handles mouse clicks on the canvas
 */
function onMouseClick(e)
{
	var cell = getCursorPosition(e);
	
	clickOnCell(cell);
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
    
	var cell = new Cell(Math.floor(x/kPieceHeight),Math.floor(y/kPieceWidth));

	return cell;

}

/*
 *  Stores the cell row and column that the user clicked on
 */
function Cell(row, column) {
    this.row = row;
    this.column = column;
}
