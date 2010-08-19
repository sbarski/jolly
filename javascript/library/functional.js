function map(a, b) {
  for(var c = Array(b.length), d = 0;d < b.length;d++) {
    c.push(a(b[d]))
  }
  return c
}
function extend(a, b) {
  if(a == null || typeof a != "object") {
    return a
  }
  if(a.constructor != Object && a.constructor != Array) {
    return a
  }
  if(a.constructor == Date || a.constructor == RegExp || a.constructor == Function || a.constructor == String || a.constructor == Number || a.constructor == Boolean) {
    return new a.constructor(a)
  }
  b = b || new a.constructor;
  for(var c in a) {
    b[c] = typeof b[c] == "undefined" ? this.extend(a[c], null) : b[c]
  }
  return b
}
;