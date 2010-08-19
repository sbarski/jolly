function lifeScore(g, i) {
  return i == 3 || i == 2 && g == 1 ? 1 : 0
}
function mapid(g) {
  for(var i = Array(g.length), j = 0;j < g.length;j++) {
    i[j] = g[j].id()
  }
  return i
}
function LifeNode(g, i, j) {
  function x(e) {
    for(var a = [], b = 0;b < 9;b++) {
      a[b] = h.subquad(b).nextCenter(e)
    }
    return a
  }
  function t() {
    if(typeof h._cache[0] != "undefined" && h._cache.length > 0) {
      return h._cache[0]
    }
    var e = h._board.getnode(h._children[0]._children[3], h._children[1]._children[2], h._children[2]._children[1], h._children[3]._children[0]);
    return h._cache[0] = e
  }
  var h = this;
  this.width = function() {
    return 1 << this._level
  };
  this.level = function() {
    return this._level
  };
  this.id = function() {
    return this._id
  };
  this.count = function() {
    return this._count
  };
  this.children = function() {
    return this._children
  };
  this.gensteps = function() {
    return 1 << this._level - 2
  };
  this.get = function(e, a) {
    if(this._level === 0) {
      return this._count
    }
    var b = Math.floor(h.width() / 2);
    return h._children[Math.floor(e / b) + Math.floor(a / b) * 2].get(e % b, a % b)
  };
  this.set = function(e, a, b) {
    if(this._level === 0) {
      return this._board.single(b)
    }
    var d = Math.floor(this.width() / 2), c = Math.floor(e / d) + Math.floor(a / d) * 2, f = extend(this._children, null);
    f[c] = f[c].set(e % d, a % d, b);
    return this._board.getnode(f[0], f[1], f[2], f[3])
  };
  this.getList = function(e, a, b, d) {
    if(this._count != 0) {
      if(d) {
        var c = d.x, f = d.y, k = d.y + d.height;
        if(a >= d.x + d.width || a + this.width() <= c || b >= k || b + this.width() <= f) {
          return
        }
      }
      if(this._level == 0) {
        e.push([a, b])
      }else {
        c = this.width() / 2;
        f = this._children[1];
        k = this._children[2];
        var m = this._children[3];
        this._children[0].getList(e, a, b, d);
        f.getList(e, a + c, b, d);
        k.getList(e, a, b + c, d);
        m.getList(e, a + c, b + c, d)
      }
    }
  };
  this.nextCenter = function(e) {
    if(e == 0) {
      return t()
    }
    if(typeof this._cache[e] != "undefined") {
      return this._cache[e]
    }
    var a = this._children[0], b = this._children[1], d = this._children[2], c = this._children[3], f, k, m;
    if(this._level == 2) {
      if(data.isInternetExplorer === false) {
        f = a.children().map(function(n) {
          return n.id()
        });
        a = b.children().map(function(n) {
          return n.id()
        });
        k = d.children().map(function(n) {
          return n.id()
        });
        m = c.children().map(function(n) {
          return n.id()
        })
      }else {
        f = mapid(a.children());
        a = mapid(b.children());
        k = mapid(d.children());
        m = mapid(c.children())
      }
      var o = f[1];
      b = f[2];
      c = f[3];
      var p = a[0], q = a[1];
      d = a[2];
      a = a[3];
      var r = k[0], l = k[1], y = k[2];
      k = k[3];
      var s = m[0], u = m[1], v = m[2];
      m = m[3];
      f = lifeScore(c, f[0] + o + p + b + d + r + l + s);
      o = lifeScore(d, o + p + q + c + a + l + s + u);
      b = lifeScore(l, b + c + d + r + s + y + k + v);
      c = lifeScore(s, c + d + a + l + u + k + v + m);
      f = this._board.memo()[[f, o, b, c]]
    }else {
      l = 0;
      f = Math.floor(this.gensteps() / 2);
      l = e <= f ? 0 : f;
      f = e - l;
      a = this._children[0];
      b = this._children[1];
      d = this._children[2];
      c = this._children[3];
      c = x(l);
      d = c[1];
      b = c[2];
      a = c[3];
      l = c[4];
      o = c[5];
      p = c[6];
      q = c[7];
      r = c[8];
      f = this._board.getnode(this._board.getnode(c[0], d, a, l).nextCenter(f), this._board.getnode(d, b, l, o).nextCenter(f), this._board.getnode(a, l, p, q).nextCenter(f), this._board.getnode(l, o, q, r).nextCenter(f))
    }
    return this._cache[e] = f
  };
  this.subquad = function(e) {
    var a = h._children[0], b = h._children[1], d = h._children[2], c = h._children[3];
    if(e == 0) {
      return a
    }
    if(e == 1) {
      return h._board.getnode(a._children[1], b._children[0], a._children[3], b._children[2])
    }
    if(e == 2) {
      return b
    }
    if(e == 3) {
      return h._board.getnode(a._children[2], a._children[3], d._children[0], d._children[1])
    }
    if(e == 4) {
      return t()
    }
    if(e == 5) {
      return h._board.getnode(b._children[2], b._children[3], c._children[0], c._children[1])
    }
    if(e == 6) {
      return d
    }
    if(e == 7) {
      return h._board.getnode(d._children[1], c._children[0], d._children[3], c._children[2])
    }
    if(e == 8) {
      return c
    }
  };
  if(i <= 1) {
    this._level = 0;
    this._count = i
  }else {
    var w = j[0], z = j[1], A = j[2], B = j[3];
    this._level = w._level + 1;
    this._count = w._count + z._count + A._count + B._count
  }
  this._id = i;
  this._children = j;
  this._board = g;
  this._cache = [];
  return this
}
function extend(g, i) {
  if(g == null || typeof g != "object") {
    return g
  }
  if(g.constructor != Object && g.constructor != Array) {
    return g
  }
  if(g.constructor == Date || g.constructor == RegExp || g.constructor == Function || g.constructor == String || g.constructor == Number || g.constructor == Boolean) {
    return new g.constructor(g)
  }
  i = i || new g.constructor;
  for(var j in g) {
    i[j] = typeof i[j] == "undefined" ? this.extend(g[j], null) : i[j]
  }
  return i
}
;