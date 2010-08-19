function LifeGame() {
  function n() {
    return new Rect(h, i, h + data.boardWidth, i + data.boardHeight)
  }
  function k() {
    var a = c.getAll(n());
    data.drawingContext.fillStyle = data.boardColour;
    for(var b = 0, d = f.length;b < d;b++) {
      var e = f[b].x, g = f[b].y;
      data.drawingContext.fillRect(e * data.pieceWidth + 1, g * data.pieceHeight + 1, data.pieceWidth - 1, data.pieceHeight - 1)
    }
    f = [];
    data.drawingContext.fillStyle = data.selectedColour;
    b = 0;
    for(d = a.length;b < d;b++) {
      e = a[b][0];
      g = a[b][1];
      data.drawingContext.fillRect(e * data.pieceWidth + 1, g * data.pieceHeight + 1, data.pieceWidth - 1, data.pieceHeight - 1);
      f.push(new Rect(e, g, 0, 0))
    }
    document.getElementById("steps").innerHTML = "Steps: " + m
  }
  function o() {
    data.drawingContext.clearRect(0, 0, data.pixelWidth(), data.pixelHeight());
    data.drawingContext.save();
    data.drawingContext.fillStyle = data.boardColour;
    data.drawingContext.fillRect(0, 0, data.pixelWidth(), data.pixelHeight());
    data.drawingContext.fillStyle = data.selectedColour;
    data.drawingContext.strokeStyle = data.borderColour;
    data.drawingContext.beginPath();
    for(var a = h;a <= data.pixelWidth();a += data.pieceWidth) {
      data.drawingContext.moveTo(0.5 + a, 0);
      data.drawingContext.lineTo(0.5 + a, data.pixelHeight())
    }
    for(a = i;a <= data.pixelHeight();a += data.pieceHeight) {
      data.drawingContext.moveTo(0, 0.5 + a);
      data.drawingContext.lineTo(data.pixelWidth(), 0.5 + a)
    }
    data.drawingContext.closePath();
    data.drawingContext.strokeStyle = data.gridColour;
    data.drawingContext.stroke();
    data.drawingContext.restore()
  }
  var c = new LifeBoard, p = new FileSystem, m = 0, l = false, f = [], i = 0, h = 0, j = null;
  o();
  this.run = function() {
    if(!l) {
      l = true;
      j = setInterval(function() {
        step(1)
      }, 100)
    }
  };
  this.stop = function() {
    l = false;
    j !== null && clearInterval(j)
  };
  this.clear = function() {
    l = false;
    j !== null && clearInterval(j);
    m = 0;
    c.clear();
    k()
  };
  this.toggle = function(a, b) {
    var d = 1 - c.get(a, b);
    c.set(a, b, d);
    if(0 >= h && 0 < h + data.boardWidth && 0 >= i && 0 < i + data.boardHeight) {
      if(c.get(a, b)) {
        f.push(new Rect(a, b, 0, 0));
        data.drawingContext.fillStyle = data.selectedColour
      }else {
        data.drawingContext.fillStyle = data.boardColour
      }
      data.drawingContext.fillRect(a * data.pieceWidth + 1, b * data.pieceHeight + 1, data.pieceWidth - 1, data.pieceHeight - 1)
    }
  };
  this.step = function(a) {
    a = parseInt(a);
    if(!(a <= 0)) {
      c.root().width() > Math.pow(2, 28) && c.collect();
      c.step(a);
      m += a;
      k()
    }
  };
  this.zoom = function() {
    o();
    k()
  };
  this.load = function(a) {
    p.handleFileSelect(a)
  };
  this.loadData = function(a) {
    this.clear();
    for(var b = 0;b < a.length;b++) {
      var d = a[b][0], e = a[b][1], g = 1 - c.get(d, e);
      c.set(d, e, g)
    }
    k()
  };
  this.board = function() {
    return c
  };
  this.getVisibleRect = function() {
    return n()
  }
}
;