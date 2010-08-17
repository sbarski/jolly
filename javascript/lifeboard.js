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
	var that = this; //This is a workaround for an error in the ECMAScript Language Specification which causes this to be set incorrectly for inner functions.

	var _root = null;
	
	var _originx = 0;
    var _originy = 0;
    
	var E = new LifeNode(that, 0, null); //we are passing the board, id and children
	var X = new LifeNode(that, 1, null);
    
	var _single = [E, X];
    var _memo = [];
	var _empty = [];
	
	for (var i = 0; i < 16; i++)
	{
		tup = [i & 1, (i & 2) / 2, (i & 4) / 4, (i & 8) / 8];
	  
		var objtup = [];
	  
		if (data.isInternetExplorer === false){
			objtup = tup.map(function(n){return _single[n]}); //array.map is not supported by IE7
		}
		else{
			objtup = mapSingleToTuple(_single, tup);
		}
	  
		_memo[tup] = new LifeNode(this, i + 2, objtup); 
	}
	 
		var index = [0,0,0,0];
	 
	_empty.push(E);
	_empty.push(_memo[index]);
	
    var _nextid = 18;
    _root = E;
	
	function emptynode(level){
		if (level < _empty.length){
			return _empty[level];
		}
		
		var e = emptynode(level - 1);
		var result = that.getnode(e, e, e, e);
		_empty.push(result);
		
		return result;
	};
	
	function canonicalize(node, trans){
		if (node.id() < 18){
			return node;
		}
		
		if (typeof(trans[node.id()]) == "undefined")
		{
			var nw = node._children[0];
			var ne = node._children[1];
			var sw = node._children[2];
			var se = node._children[3];
			
		  trans[node.id()] = that.getnode(
			canonicalize(nw, trans),
			canonicalize(ne, trans),
			canonicalize(sw, trans),
			canonicalize(se, trans));
		}
		
		return trans[node.id()];
	};

	function trim(){
		while (1)
		{
			if (_root.count() === 0){
					_root = _single[0];
			}
					
			if (_root.level() <= 1){
					return;
			}
								
				var sub = null;
				for (var index = 0; index < 9; index++)
				{
					sub = _root.subquad(index);
			
					if (sub.count() == _root.count())
					{
						_originx += Math.floor(sub.width() / 2) * Math.floor(index % 3);
						_originy += Math.floor(sub.width() / 2) * Math.floor(index / 3);
						_root = sub;
						break;
					}
					sub = null;
				}
				
				if (sub === null)
					return;
		}
	};
	
	function getDouble(){
		if (_root.level() == 0){
			var index = [_root.id(), 0, 0, 0];
			_root = _memo[index];
			return;
		}
		
		_originx -= _root.width() / 2;
		_originy -= _root.width() / 2;
		
		var e = emptynode(_root.level() - 1);
		var nw = _root._children[0];
		var ne = _root._children[1];
		var sw = _root._children[2];
		var se = _root._children[3];
		
		_root = that.getnode(
		  that.getnode(e, e, e, nw), that.getnode(e, e, ne, e),
		  that.getnode(e, sw, e, e), that.getnode(se, e, e, e));
	};

	
	this.getnode = function(nw, ne, sw, se){
		var result = null;
		var tup = [nw.id(), ne.id(), sw.id(), se.id()];
		
		var result;// = _memo[tup];
		
		if (typeof(_memo[tup]) != "undefined"){
			result = _memo[tup];
		}
		else{
			result = new LifeNode(this, _nextid, [nw, ne, sw, se]);
			_nextid = _nextid + 1;
			_memo[tup] = result;
		}
		
		return result;
	};

	this.get = function(x, y){
		if (x < _originx || y < _originy || x >= _originx + _root.width() || y >= _originy + _root.width()){
		  return 0;
		}
		  
		return _root.get(x - _originx, y - _originy);
	};
	
	this.getAll = function(rect){
		cells = [];
		_root.getList(cells, _originx, _originy, rect);
		return cells;
	};
	
	this.set = function(x, y, value){
		if (this.get(x, y) === value){
			return;
		}
		  
		var width = _root.width();
		
		while (x < _originx || y < _originy || x >= _originx + width || y >= _originy + width)
		{
			getDouble();
			width = _root.width();
		}
		
		_root = _root.set(x - _originx, y - _originy, value);
	};
	
	this.step = function(steps){
		if (steps == 0){
			return;
		}
			
		getDouble();
		getDouble();
		
		while (steps > _root.gensteps()){
			steps -= _root.gensteps();
			_root = _root.nextCenter(_root.gensteps());
			_originx = _originx + _root.width() / 2;
			_originy = _originy + _root.width() / 2;
			getDouble();
			getDouble();
		}
		
		_root = _root.nextCenter(steps);
		_originx = _originx + _root.width() / 2;
		_originy = _originy + _root.width() / 2;
	};
	
	this.collect = function(){
		trim();
		
		_empty = [];
		
		_empty.push(_single[0]);
		_empty.push(_memo[[0, 0, 0, 0]]);
		
		var old = _memo; 
		_memo = [];
		
		for (var i = 0; i < 16; i++)
		{
			var tup = [i & 1, (i & 2) / 2, (i & 4) / 4, (i & 8) / 8]; 
			_memo[tup] = old[tup];
		}
		
		var trans = [];
		_root = canonicalize(_root, trans);
	};
		
	this.clear = function(self){
		_root = _single[0];
		this.collect();
	};
	
	this.count = function(){
		return _root.count;
	};
	
	this.root = function(){
		return _root;
	};

	this.memo = function(){
		return _memo;
	};

	this.single = function(index){
		return _single[index];
	};

	this.width = function(){
		return _root.width();
	};
};