"use strict";

function lifeScore(center, surround){
	//"Conway's game of life rules: birth on 3, survival on 2 or 3"
	if (surround == 3 || (surround == 2 && center == 1)){
		return 1;
	}
	else{
		return 0;
	}
}

function mapid(tup){
	var indexedNodes = new Array(tup.length);
	
	for (var i = 0; i < tup.length; i++){
		indexedNodes[i] = tup[i].id();
	}
		
	return indexedNodes;
}


function LifeNode(board, id, children){ //Class LifeNode
	//A 2^level-square life node"
	if(id <= 1)
	{
		this._level = 0;
		this._count = id;
    }
	else
	{
      
		this.nw = children[0];
		this.ne = children[1];
		this.sw = children[2];
		this.se = children[3];

		this._level = this.nw.level() + 1;
		this._count = this.nw.count() + this.ne.count() + this.sw.count() + this.se.count();
	 }
	 
    this._id = id;
    this._children = children;
    this._board = board;
    this._cache = [];
	
	return this;
}

LifeNode.prototype.level = function(){
	return this._level;
};

LifeNode.prototype.id = function(){
	return this._id;
};

LifeNode.prototype.count = function(){
	return this._count;
};

LifeNode.prototype.children = function(){
	return this._children;
};

LifeNode.prototype.get = function(x, y){
    //"Returns the value of the cell at x, y"
    if (this._level === 0){
		return this._count;
		
	}
	
    var half = Math.floor(this.width() / 2);
	
	//var index = Math.floor(x / half) + Math.floor(y / Math.floor(half * 2));
	
	var index = Math.floor(x / half) + (Math.floor(y / half) * 2);
	
		 	//console.log("lifenode.get" + ", " + index + ", " + this._level + ", " + this._count);
	
    var child = this._children[index];
    return child.get(x % half, y % half);
};

LifeNode.prototype.set = function(x, y, value){
	//"Returns a near-copy of the node with the value at x, y modified"
    if (this._level === 0){
		return this._board.single(value);
	}
	
	var half = Math.floor(this.width() / 2);
	//var index = Math.floor(x / half) + Math.floor(y / Math.floor(half * 2));

	var index = Math.floor(x / half) + (Math.floor(y / half) * 2);
	
	
    var mychildren = extend(this._children, null);
    //console.log("lifenode.set" + index + ", " + value);
	
	mychildren[index] = mychildren[index].set(x % half, y % half, value);
	
	return this._board.getnode(mychildren[0], mychildren[1], mychildren[2], mychildren[3]);
};

LifeNode.prototype.getList = function(result, x, y, rect){
    //"Returns the coordinates of all the filled cells in the given rect"
    if (this._count == 0){
		return;
	}
    
	if (rect)
	{
		//minx, miny, maxx, maxy = rect;
	
		var minx = rect.x;
		var miny = rect.y;
		var maxx = rect.x + rect.width;
		var maxy = rect.y + rect.height;
	      
		if (x >= maxx || x + this.width() <= minx || y >= maxy || y + this.width() <= miny){
			return;
		}
	}
    
	if (this._level == 0)
	{
		result.push([x, y]); //I am not sure what is going on here ????
	}
    else
	{
		var half = this.width() / 2;
		
		var nw = this._children[0];
		var ne = this._children[1];
		var sw = this._children[2];
		var se = this._children[3];
	
		nw.getList(result, x, y, rect);
		ne.getList(result, x + half, y, rect);
		sw.getList(result, x, y + half, rect);
		se.getList(result, x + half, y + half, rect);
	}
};


LifeNode.prototype.list = function(children){
	var returnArray = new Array(children.length);
	
	for (var i = 0; i < children.length; i++)
	{
		returnArray[i] = children[i].clone();
	}
};

LifeNode.prototype.nextCenter = function(steps){
	//"Returns a level-1 node advanced the given number of generations."
	if (steps == 0){
		return this.center();
	}
		
	var cacheHit = this._cache[steps];
    if (typeof(cacheHit) != "undefined"){
		return this._cache[steps];
	}
    
	var nw = this._children[0];
	var ne = this._children[1];
	var sw = this._children[2];
	var se = this._children[3];
	
	var result;
	
	var nwChildren; var neChildren; var swChildren; var seChildren;
	
	if (this._level == 2)
	{
		if (isInternetExplorer === false)
		{
			nwChildren = this.nw.children().map(function(n){return n.id()});
			neChildren = this.ne.children().map(function(n){return n.id()});
			swChildren = this.sw.children().map(function(n){return n.id()});
			seChildren = this.se.children().map(function(n){return n.id()});
		}
		else
		{
			nwChildren = mapid(this.nw.children());
			neChildren = mapid(this.ne.children());
			swChildren = mapid(this.sw.children());
			seChildren = mapid(this.se.children());
		}
	
		var aa = nwChildren[0]; var ab = nwChildren[1]; var ba = nwChildren[2]; var bb = nwChildren[3];
		
		var ac = neChildren[0]; var ad = neChildren[1]; var bc = neChildren[2]; var bd = neChildren[3];
		
		var ca = swChildren[0]; var cb = swChildren[1]; var da = swChildren[2]; var db = swChildren[3];
		
		var cc = seChildren[0]; var cd = seChildren[1]; var dc = seChildren[2]; var dd = seChildren[3];
      
		var nwscore = lifeScore(bb, aa + ab + ac + ba + bc + ca + cb + cc);
		var nescore = lifeScore(bc, ab + ac + ad + bb + bd + cb + cc + cd);
		var swscore = lifeScore(cb, ba + bb + bc + ca + cc + da + db + dc);
		var sescore = lifeScore(cc, bb + bc + bd + cb + cd + db + dc + dd);
		
		var memo = this._board.memo();
		
		var index = [nwscore, nescore, swscore, sescore];
		result = memo[index];
		//result = result2;
	}
    else
	{
		var step1 = 0;
		var halfsteps = Math.floor(this.gensteps() / 2);
      
		if (steps <= halfsteps){
			step1 = 0;
		}
		else{
			step1 = halfsteps;
		}
		
		var step2 = steps - step1;
		
		nw = this._children[0];
		ne = this._children[1];
		sw = this._children[2];
		se = this._children[3];
		
		var sub = this.getSavedCenter(step1);
		//n00, n01, n02, n10, n11, n12, n20, n21, n22 = map(lambda x: this._subquad(x).nextCenter(step1), range(9)); <-- not implemented what is this??
		var n00 = sub[0]; var n01 = sub[1]; var n02 = sub[2];
		var n10 = sub[3]; var n11 = sub[4]; var n12 = sub[5];
		var n20 = sub[6]; var n21 = sub[7]; var n22 = sub[8];
	  
	  
		result = this._board.getnode(
			this._board.getnode(n00, n01, n10, n11).nextCenter(step2),
			this._board.getnode(n01, n02, n11, n12).nextCenter(step2),
			this._board.getnode(n10, n11, n20, n21).nextCenter(step2),
			this._board.getnode(n11, n12, n21, n22).nextCenter(step2));
	}
    
	this._cache[steps] = result;
    return result;
};

LifeNode.prototype.getSavedCenter = function(step1){
	var result = [];
	
	for (var i = 0; i < 9; i++)
	{
		result[i] = this.subquad(i).nextCenter(step1);
	}
	
	return result;
};

LifeNode.prototype.center = function(){
	if (typeof(this._cache[0]) != "undefined" && this._cache.length > 0){
		return this._cache[0];
	}
		
	var nw = this._children[0];
	var ne = this._children[1];
	var sw = this._children[2];
	var se = this._children[3];
	
    var result = this._board.getnode(nw._children[3], ne._children[2], sw._children[1], se._children[0]);
    this._cache[0] = result;
	
    return result;
};

LifeNode.prototype.subquad = function(i){
	var nw = this._children[0];
	var ne = this._children[1];
	var sw = this._children[2];
	var se = this._children[3];
    
	if (i == 0){ return nw;}
    if (i == 1){ return this._board.getnode(nw._children[1], ne._children[0],nw._children[3], ne._children[2]);}
    if (i == 2){ return ne;}
    if (i == 3){ return this._board.getnode(nw._children[2], nw._children[3],sw._children[0], sw._children[1]);}
    if (i == 4){ return this.center();}
    if (i == 5){ return this._board.getnode(ne._children[2], ne._children[3],se._children[0], se._children[1]);}
    if (i == 6){ return sw;}
    if (i == 7){ return this._board.getnode(sw._children[1], se._children[0],sw._children[3], se._children[2]);}
    if (i == 8){ return se;}
};

LifeNode.prototype.width = function(i){
    return 1 << this._level;
};
 
LifeNode.prototype.gensteps = function(){
    return 1 << (this._level - 2);
};

function extend(from, to)
{
    if (from == null || typeof from != "object") return from;
    if (from.constructor != Object && from.constructor != Array) return from;
    if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
        from.constructor == String || from.constructor == Number || from.constructor == Boolean)
        return new from.constructor(from);

    to = to || new from.constructor();

    for (var name in from)
    {
        to[name] = typeof to[name] == "undefined" ? this.extend(from[name], null) : to[name];
    }

    return to;
}