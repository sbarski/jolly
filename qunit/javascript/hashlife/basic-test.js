//http://docs.jquery.com/QUnit#Using_QUnit

module("setup/teardown test", {
	setup: function(){
		kBoardWidth = 10;
		kBoardHeight = 10;
		var hashlife = initEngine(null);
		ok(true);
	},
	teardown: function(){
		hashlife = null;
		ok(true);
	}
});

test("check that canvas element and the drawing context are ok", function() {
	expect(5);
	
	ok(gCanvasElement, "canvas element: OK");
	ok(gDrawingContext, "drawing context: OK");
	ok(kBoardWidth >= 10 && kBoardHeight >= 10, "board dimensions: OK");
});


module("basic hashlife tests", {
	setup: function(){
		var hashlife = initEngine(null);
		ok(true);
	},
	teardown: function(){
		hashlife = null;
		ok(true);
	}
});

test("add and remove life", function() {
	expect(14);
	
	var board = lifeGame.board();
	
	lifeGame.toggle(0, 0);
	lifeGame.toggle(0, 1);
	lifeGame.toggle(1, 0);
	lifeGame.toggle(1, 1);
	
	ok(board.get(0, 0), "added life at 0,0: OK");
	ok(board.get(0, 1), "added life at 0,1: OK");
	ok(board.get(1, 0), "added life at 1,0: OK");
	ok(board.get(1, 1), "added life at 1,1: OK");
	
	lifeGame.toggle(0, 0);
	lifeGame.toggle(0, 1);
	lifeGame.toggle(1, 0);
	lifeGame.toggle(1, 1);
	
	ok(board.get(0, 0) === 0, "removed life at 0,0: OK");
	ok(board.get(0, 1) === 0, "removed life at 0,1: OK");
	ok(board.get(1, 0) === 0, "removed life at 1,0: OK");
	ok(board.get(1, 1) === 0, "removed life at 1,1: OK");
	
	lifeGame.toggle(9,9);
	lifeGame.toggle(9,10);
	lifeGame.toggle(10,9);
	lifeGame.toggle(10,10);
	
	ok(board.get(9,9), "added life at 9,9: OK");
	ok(board.get(9,10), "added life at 9,10: OK");
	ok(board.get(10,9), "added life at 10,9: OK");
	ok(board.get(10,10), "added life at 10,10: OK");
});

test("visible rect", function() {
	lifeGame.toggle(9,9);
	lifeGame.toggle(9,10);
	lifeGame.toggle(10,9);
	lifeGame.toggle(10,10);
	
	setCanvasDimensions(10,10);
	
	var board = lifeGame.board();
	var visibleRect = lifeGame.getVisibleRect();
	var cells = board.getAll(visibleRect);
	
	equals(cells.length, 1, "visible rect: OK");
	
	lifeGame.toggle(0,0);
	lifeGame.toggle(0,1);
	lifeGame.toggle(-1,0);
	lifeGame.toggle(-1,-1);
	
	cells = board.getAll(visibleRect);
	equals(cells.length, 3, "visible rect: OK");
	
	lifeGame.toggle(5, 5);
	lifeGame.toggle(5, 6);
	lifeGame.toggle(6, 5);
	lifeGame.toggle(6, 6);
	
	cells = board.getAll(visibleRect);
	equals(cells.length, 7, "visible rect: OK");
});

var board = null;

module("rule tests", {
	setup: function(){
		var hashlife = initEngine(null);
		board = lifeGame.board();
		ok(true);
	},
	teardown: function(){
		hashlife = null;
		ok(true);
	}
});

test("block", function() {
	lifeGame.toggle(1, 1);
	lifeGame.toggle(1, 2);
	lifeGame.toggle(2, 1);
	lifeGame.toggle(2, 2);
	
	lifeGame.step(1);
	
	ok(board.get(1, 1), "1,1: OK");
	ok(board.get(1, 2), "1,2: OK");
	ok(board.get(2, 1), "2,1: OK");
	ok(board.get(2, 2), "2,2: OK");
	
	equals(board.get(0,0), 0, "0,0 is empty: OK");
	equals(board.get(3,3), 0, "3,3 is empty: OK");
});

test("beehive", function() {
	lifeGame.toggle(0, 2);
	lifeGame.toggle(1, 1);
	lifeGame.toggle(1, 3);
	lifeGame.toggle(2, 1);
	lifeGame.toggle(2, 3);
	lifeGame.toggle(3, 2);

	step(1);
	
	ok(board.get(0, 2), "1,1: OK");
	ok(board.get(1, 1), "1,2: OK");
	ok(board.get(1, 3), "1,3: OK");
	ok(board.get(2, 1), "2,1: OK");
	ok(board.get(2, 3), "2,3: OK");
	ok(board.get(3, 2), "3,2: OK");
	
	equals(board.get(1,2), 0, "1,2 is empty: OK");
	equals(board.get(2,2), 0, "2,2 is empty: OK");
});

test("loaf", function() {
	lifeGame.toggle(0, 2);
	lifeGame.toggle(1, 1);
	lifeGame.toggle(1, 3);
	lifeGame.toggle(2, 1);
	lifeGame.toggle(2, 4);
	lifeGame.toggle(3, 2);
	lifeGame.toggle(3, 3);

	step(1);
	
	ok(board.get(0, 2), "0,2: OK");
	ok(board.get(1, 1), "1,1: OK");
	ok(board.get(1, 3), "1,3: OK");
	ok(board.get(2, 1), "2,1: OK");
	ok(board.get(2, 4), "2,4: OK");
	ok(board.get(3, 2), "3,2: OK");
	ok(board.get(3, 3), "3,3: OK");

	equals(board.get(1,2), 0, "1,2 is empty: OK");
	equals(board.get(2,2), 0, "2,2 is empty: OK");
	equals(board.get(2,3), 0, "2,3 is empty: OK");
});

test("boat", function() {
	lifeGame.toggle(1, 1);
	lifeGame.toggle(1, 2);
	lifeGame.toggle(2, 1);
	lifeGame.toggle(2, 3);
	lifeGame.toggle(3, 2);
	
	step(1);
	
	ok(board.get(1, 1), "1,1: OK");
	ok(board.get(1, 2), "1,2: OK");
	ok(board.get(2, 1), "2,1: OK");
	ok(board.get(2, 3), "2,3: OK");
	ok(board.get(3, 2), "3,2: OK");
	
	equals(board.get(2,2), 0, "2,2 is empty: OK");
	equals(board.get(1,3), 0, "2,3 is empty: OK");
});

test("blinker", function() {
	lifeGame.toggle(1, 1);
	lifeGame.toggle(1, 2);
	lifeGame.toggle(1, 3);
	
	step(1);
	
	ok(board.get(0, 2), "0,2: OK");
	ok(board.get(1, 2), "1,2: OK");
	ok(board.get(2, 2), "2,2: OK");
	
	equals(board.get(1,1), 0, "1,1 is empty: OK");
	equals(board.get(1,3), 0, "1,3 is empty: OK");
	
	step(1);
	
	ok(board.get(1, 1), "1,1: OK");
	ok(board.get(1, 2), "1,2: OK");
	ok(board.get(1, 3), "2,3: OK");
	
	equals(board.get(0,2), 0, "0,2 is empty: OK");
	equals(board.get(2,2), 0, "2,2 is empty: OK");
});

test("glider", function() {
	lifeGame.toggle(1, 1);
	lifeGame.toggle(2, 2);
	lifeGame.toggle(2, 3);
	lifeGame.toggle(1, 3);
	lifeGame.toggle(0, 3);
	
	step(1);
	
	ok(board.get(0, 2), "0,2: OK");
	ok(board.get(2, 2), "2,2: OK");
	ok(board.get(1, 3), "1,3: OK");
	ok(board.get(2, 3), "2,3: OK");
	ok(board.get(1, 4), "1,4: OK");
	
	equals(board.get(1,2), 0, "1,2 is empty: OK");
	equals(board.get(0,3), 0, "0,3 is empty: OK");
	equals(board.get(0,4), 0, "0,4 is empty: OK");
	
	step(1);
	
	ok(board.get(0, 3), "0,3: OK");
	ok(board.get(1, 4), "1,4: OK");
	ok(board.get(2, 2), "2,3: OK");
	ok(board.get(2, 3), "2,3: OK");
	ok(board.get(2, 4), "2,4: OK");
	
	equals(board.get(0,4), 0, "0,4 is empty: OK");
	equals(board.get(1,2), 0, "1,2 is empty: OK");
	equals(board.get(1,3), 0, "1,3 is empty: OK");
});