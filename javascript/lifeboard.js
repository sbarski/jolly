function mapSingleToTuple(q, k) {
  for(var l = [], d = 0;d < k.length;d++) {
    l.push(q[k[d]])
  }
  return l
}
function LifeBoard() {
  function q(a) {
    if(a < m.length) {
      return m[a]
    }
    a = q(a - 1);
    a = d.getnode(a, a, a, a);
    m.push(a);
    return a
  }
  function k(a, c) {
    if(a.id() < 18) {
      return a
    }
    if(typeof c[a.id()] == "undefined") {
      var e = a._children[0], i = a._children[1], n = a._children[2], p = a._children[3];
      c[a.id()] = d.getnode(k(e, c), k(i, c), k(n, c), k(p, c))
    }
    return c[a.id()]
  }
  function l() {
    if(b.level() == 0) {
      var a = [b.id(), 0, 0, 0];
      b = f[a]
    }else {
      g -= b.width() / 2;
      h -= b.width() / 2;
      a = q(b.level() - 1);
      var c = b._children[1], e = b._children[2], i = b._children[3];
      b = d.getnode(d.getnode(a, a, a, b._children[0]), d.getnode(a, a, c, a), d.getnode(a, e, a, a), d.getnode(i, a, a, a))
    }
  }
  var d = this, b = null, g = 0, h = 0, r = new LifeNode(d, 0, null), j = new LifeNode(d, 1, null), o = [r, j], f = [], m = [];
  for(j = 0;j < 16;j++) {
    tup = [j & 1, (j & 2) / 2, (j & 4) / 4, (j & 8) / 8];
    var s = [];
    s = data.isInternetExplorer === false ? tup.map(function(a) {
      return o[a]
    }) : mapSingleToTuple(o, tup);
    f[tup] = new LifeNode(this, j + 2, s)
  }
  m.push(r);
  m.push(f[[0, 0, 0, 0]]);
  var t = 18;
  b = r;
  this.getnode = function(a, c, e, i) {
    var n = null, p = [a.id(), c.id(), e.id(), i.id()];
    if(typeof f[p] != "undefined") {
      n = f[p]
    }else {
      n = new LifeNode(this, t, [a, c, e, i]);
      t += 1;
      f[p] = n
    }
    return n
  };
  this.get = function(a, c) {
    if(a < g || c < h || a >= g + b.width() || c >= h + b.width()) {
      return 0
    }
    return b.get(a - g, c - h)
  };
  this.getAll = function(a) {
    cells = [];
    b.getList(cells, g, h, a);
    return cells
  };
  this.set = function(a, c, e) {
    if(this.get(a, c) !== e) {
      for(var i = b.width();a < g || c < h || a >= g + i || c >= h + i;) {
        l();
        i = b.width()
      }
      b = b.set(a - g, c - h, e)
    }
  };
  this.step = function(a) {
    if(a != 0) {
      l();
      for(l();a > b.gensteps();) {
        a -= b.gensteps();
        b = b.nextCenter(b.gensteps());
        g += b.width() / 2;
        h += b.width() / 2;
        l();
        l()
      }
      b = b.nextCenter(a);
      g += b.width() / 2;
      h += b.width() / 2
    }
  };
  this.collect = function() {
    a:for(;;) {
      if(b.count() === 0) {
        b = o[0]
      }
      if(b.level() <= 1) {
        break a
      }
      for(var a = null, c = 0;c < 9;c++) {
        a = b.subquad(c);
        if(a.count() == b.count()) {
          g += Math.floor(a.width() / 2) * Math.floor(c % 3);
          h += Math.floor(a.width() / 2) * Math.floor(c / 3);
          b = a;
          break
        }
        a = null
      }
      if(a === null) {
        break a
      }
    }
    m = [];
    m.push(o[0]);
    m.push(f[[0, 0, 0, 0]]);
    a = f;
    f = [];
    for(c = 0;c < 16;c++) {
      var e = [c & 1, (c & 2) / 2, (c & 4) / 4, (c & 8) / 8];
      f[e] = a[e]
    }
    b = k(b, [])
  };
  this.clear = function() {
    b = o[0];
    this.collect()
  };
  this.count = function() {
    return b.count
  };
  this.root = function() {
    return b
  };
  this.memo = function() {
    return f
  };
  this.single = function(a) {
    return o[a]
  };
  this.width = function() {
    return b.width()
  }
}
;