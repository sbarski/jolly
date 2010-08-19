var data = {canvasElement:null, drawingContext:null, fileSystem:null, boardColour:"#ccc", borderColour:"#000", gridColour:"#FFFF99", selectedColour:"#000000", trailColour:"#9900FF", boardWidth:800, boardHeight:400, pieceWidth:20, pieceHeight:20, isInternetExplorer:false, pixelWidth:function() {
  return 1 + this.boardWidth
}, pixelHeight:function() {
  return 1 + this.boardHeight
}}, lifeGame = null, canvasElement = null;
function initEngine() {
  canvasElement = document.createElement("canvas");
  canvasElement.id = "lifegame_canvas";
  document.getElementById("canvasSpace").appendChild(canvasElement);
  if(typeof window.G_vmlCanvasManager != "undefined") {
    canvasElement = window.G_vmlCanvasManager.initElement(canvasElement);
    isInternetExplorer = true
  }
  setCanvasDimensions();
  data.canvasElement = canvasElement;
  data.canvasElement.width = data.boardWidth;
  data.canvasElement.height = data.boardHeight;
  data.drawingContext = canvasElement.getContext("2d");
  if(data.canvasElement.addEventListener) {
    data.canvasElement.addEventListener("click", onMouseClick, false)
  }else {
    data.canvasElement.attachEvent ? data.canvasElement.attachEvent("onclick", onMouseClick) : alert("Your browser will not work for this example.")
  }
  data.fileSystem = new FileSystem;
  document.getElementById("file").addEventListener("change", data.fileSystem.handleFileSelect, false);
  lifeGame = new LifeGame
}
function setCanvasDimensions() {
}
function viewport() {
  document.documentElement.clientHeight || document.getElementsByTagName("body");
  document.getElementsByTagName("body");
  return{width:1200, height:600}
}
function onMouseClick(a) {
  a = getCursorPosition(a);
  lifeGame.toggle(a.x, a.y)
}
function getCursorPosition(a) {
  var b;
  if(a.pageX || a.pageY) {
    b = a.pageX;
    a = a.pageY
  }else {
    b = a.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
    a = a.clientY + document.documentElement.scrollTop + document.body.scrollTop
  }
  b -= data.canvasElement.offsetLeft;
  a -= data.canvasElement.offsetTop;
  b = Math.min(b, data.boardWidth * data.pieceWidth);
  a = Math.min(a, data.boardHeight * data.pieceHeight);
  return new Rect(Math.floor(b / data.pieceHeight), Math.floor(a / data.pieceWidth))
}
function step() {
  lifeGame.step(1)
}
function run() {
  lifeGame.run()
}
function stop() {
  lifeGame.stop()
}
function clear() {
  lifeGame.clear()
}
function zoom(a) {
  if(a == 0) {
    data.pieceWidth = 20;
    data.pieceHeight = 20
  }else {
    if(a > 0 && data.pieceWidth < 80 && data.pieceHeight < 80) {
      data.pieceWidth *= 2;
      data.pieceHeight *= 2
    }else {
      if(a < 0 && data.pieceWidth > 5 && data.pieceHeight > 5) {
        data.pieceWidth /= 2;
        data.pieceHeight /= 2
      }
    }
  }
  setCanvasDimensions();
  lifeGame.zoom(a)
}
function Rect(a, b, c, d) {
  this.x = a;
  this.y = b;
  this.width = c;
  this.height = d
}
;