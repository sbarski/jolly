"use strict";

function mapSingleToTuple(single, tup){
	var array = [];//new Array(tup.length);
	
	for (var i = 0; i < tup.length; i++)
	{
		array.push(single[tup[i]]);
	}
	
	return array;
}

function LifeBoard(){
	this._originx = 0;
    this._originy = 0;
    
	var E = new LifeNode(this, 0, null); //we are passing the board, id and children
	var X = new LifeNode(this, 1, null);
    
	this._single = [E, X];
    this._memo = [];
	this._empty = [];
	
	for (var i = 0; i < 16; i++)
	{
		this.tup = [i & 1, (i & 2) / 2, (i & 4) / 4, (i & 8) / 8];
	  
		//var objtup = map(lambda x: this._single[x], tup); //<-- not implemented yet
		var objtup = mapSingleToTuple(this._single, this.tup);
	  
		this._memo[this.tup] = new LifeNode(this, i + 2, objtup); //<-- not implemented yet
	}
	 
		var index = [0,0,0,0];
	 
	this._empty.push(E);
	this._empty.push(this._memo[index]);
	
    this._nextid = 18;
    this._root = E;
}

LifeBoard.prototype._root = null;
LifeBoard.prototype._originx = 0;
LifeBoard.prototype._originy = 0;

LifeBoard.prototype.root = function(){
	return this._root;
};

LifeBoard.prototype.memo = function(){
	return this._memo;
};

LifeBoard.prototype.single = function(){
	return this._single;
};

LifeBoard.prototype.width = function(){
	return this._root.width();
};

LifeBoard.prototype.getnode = function(nw, ne, sw, se){
	var result = null;
    var tup = [nw.id(), ne.id(), sw.id(), se.id()];
	
	var result;// = this._memo[tup];
	
	if (typeof(this._memo[tup]) != "undefined"){
		result = this._memo[tup];
	}
	else{
	    result = new LifeNode(this, this._nextid, [nw, ne, sw, se]);
		this._nextid = this._nextid + 1;
		this._memo[tup] = result;
	}
	
	//console.log("lifeboard.getnode");
	
	return result;
};

LifeBoard.prototype.emptynode = function(level){
	if (level < this._empty.length){
		return this._empty[level];
	}
	
	var e = this.emptynode(level - 1);
    var result = this.getnode(e, e, e, e);
    this._empty.push(result);
	
    return result;
};

LifeBoard.prototype.canonicalize = function(node, trans){
    if (node.id() < 18){
		return node;
	}
    
	if (typeof(trans[node.id()]) != "undefined")
	{
		this.nw = node._children[0];
		this.ne = node._children[1];
		this.sw = node._children[2];
		this.se = node._children[3];
		
      trans[node.id()] = this._getnode(
        this._canonicalize(nw, trans),
        this._canonicalize(ne, trans),
        this._canonicalize(sw, trans),
        this._canonicalize(se, trans));
	}
	
    return trans[node.id()];
};

LifeBoard.prototype.clear = function(self){
    this._root = this._single[0];
    this._collect();
};

LifeBoard.prototype.collect = function(){
	this.trim();
	
	this._empty = [];
    
	this._empty.push(this._single[0]);
	this._empty.push(this._memo[[0, 0, 0, 0]]);
    
	var old = this._memo; 
	this._memo = new Array(16);
    
	for (var i = 0; i < 16; i++)
	{
		var tup = [i & 1, (i & 2) / 2, (i & 4) / 4, (i & 8) / 8]; //<-- not implemented
		this._memo[tup] = old[tup]; //<-- not implemented
    }
	
	var trans = [];
    this._root = this.canonicalize(this._root, trans);
};

LifeBoard.prototype.trim = function(){
    while (1)
	{
		if (this._root.count() === 0){
				this._root = this._single[0];
		}
				
		if (this._root.level() <= 1){
				return;
		}
							
			var sub = null;
			for (var index = 0; index < 9; index++)
			{
				sub = this._root.subquad(index);
        
				if (sub.count == this._root.count)
				{
					this._originx += sub.width() / 2 * (index % 3);
					this._originy += sub.width() / 2 * (index / 3);
					this._root = sub;
					break;
				}
				
				return; //--? I think
			}
			
			//if (this._root.count != sub.count){
			//	return;
			//}		
	}
};

LifeBoard.prototype.getDouble = function(){
    if (this._root.level() == 0){
		var index = [this._root.id(), 0, 0, 0];
		this._root = this._memo[index];
		return;
	}
	
	//console.log("lifeboard.getdouble");
	
    this._originx -= this._root.width() / 2;
    this._originy -= this._root.width() / 2;
	
    var e = this.emptynode(this._root.level() - 1);
	var nw = this._root._children[0];
	var ne = this._root._children[1];
	var sw = this._root._children[2];
	var se = this._root._children[3];
    
	this._root = this.getnode(
      this.getnode(e, e, e, nw), this.getnode(e, e, ne, e),
      this.getnode(e, sw, e, e), this.getnode(se, e, e, e));
};

LifeBoard.prototype.get = function(x, y){
    if (x < this._originx || y < this._originy || x >= this._originx + this._root.width() || y >= this._originy + this._root.width()){
      return 0;
	}
	  
    return this._root.get(x - this._originx, y - this._originy);
};

LifeBoard.prototype.getAll = function(rect){ //rect = None
    cells = [];
    this._root.getList(cells, this._originx, this._originy, rect);
    return cells;
};

LifeBoard.prototype.set = function(x, y, value){
    if (this.get(x, y) === value){
		return;
	}
	  
	//console.log("lifeboard.set");
	var width = this._root.width();
	
    while (x < this._originx || y < this._originy || x >= this._originx + width || y >= this._originy + width)
	{
		this.getDouble();
		width = this._root.width();
	}
	
    this._root = this._root.set(x - this._originx, y - this._originy, value);
};

LifeBoard.prototype.step = function(steps){
    if (steps == 0){
		return;
	}
		
    this.getDouble();
    this.getDouble();
    
	while (steps > this._root.gensteps()){
		steps -= this._root.gensteps();
		this._root = this._root.nextCenter(this._root.gensteps());
		this._originx = this._originx + this._root.width() / 2;
		this._originy = this._originy + this._root.width() / 2;
		this.getDouble();
		this.getDouble();
	}
	
    this._root = this._root.nextCenter(steps);
    this._originx = this._originx + this._root.width() / 2;
    this._originy = this._originy + this._root.width() / 2;
};

LifeBoard.prototype.count = function(){
    return this._root.count;
};

LifeBoard.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};