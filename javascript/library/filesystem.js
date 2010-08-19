function FileSystem() {
  function b(f) {
    switch(f.target.error.code) {
      case f.target.error.NOT_FOUND_ERR:
        alert("File Not Found!");
        break;
      case f.target.error.NOT_READABLE_ERR:
        alert("File is not readable");
        break;
      case f.target.error.ABORT_ERR:
        break;
      default:
        alert("An error occurred reading this file.")
    }
  }
  var g;
  this.handleFileSelect = function(f) {
    g = new FileReader;
    g.onerror = b;
    g.onabort = function() {
      alert("File read cancelled")
    };
    g.onloadstart = function() {
      document.getElementById("progress_bar").className = "loading"
    };
    g.onload = function(h) {
      processFile(h.target.result)
    };
    g.readAsText(f.target.files[0])
  }
}
function processFile(b) {
  function g(d) {
    for(var j = [], c = 0, a = d.length;c < a;c++) {
      for(var i = 0, e = d[c].length;i < e;i++) {
        d[c][i] === "O" && j.push([c, i])
      }
    }
    return j
  }
  function f(d) {
    for(var j = 0, c = 0, a = "0", i = [], e = 0, m = d.length;e < m;e++) {
      for(var k = 0, n = d[e].length;k < n;k++) {
        if(d[e][k] === "b") {
          a = parseInt(a, 10);
          if(a === 0) {
            c++
          }else {
            c += a
          }
          a = "0"
        }else {
          if(d[e][k] === "o") {
            a = parseInt(a, 10);
            if(a === 0) {
              c++;
              i.push([c - 1, j])
            }else {
              for(var l = 1;l <= a;l++) {
                i.push([c + l - 1, j])
              }
              c += a
            }
            a = "0"
          }else {
            if(d[e][k] === "$") {
              c = 0;
              j++;
              a = "0"
            }else {
              a += d[e][k]
            }
          }
        }
      }
    }
    return i
  }
  b = b.split("\r\n");
  for(var h = 0;h < b.length;h++) {
    if(b[h][0] === "!" || b[h][0] === "#") {
      b.splice(h, 1);
      h--
    }
  }
  if(b[0][0] === "." || b[0][0] === "O") {
    lifeGame.loadData(g(b))
  }else {
    if(b[0][0] === "x") {
      b.splice(0, 1);
      lifeGame.loadData(f(b))
    }
  }
}
;