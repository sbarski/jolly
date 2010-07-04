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
	expect(10);
	
	toggle(0, 0);
	toggle(0, 1);
	toggle(1, 0);
	toggle(1, 1);
	
	ok(board.get(0, 0), "added life at 0/0: OK");
	ok(board.get(0, 1), "added life at 0/1: OK");
	ok(board.get(1, 0), "added life at 1/0: OK");
	ok(board.get(1, 1), "added life at 1/1: OK");
	
	toggle(0, 0);
	toggle(0, 1);
	toggle(1, 0);
	toggle(1, 1);
	
	ok(board.get(0, 0) === 0, "removed life at 0/0: OK");
	ok(board.get(0, 1) === 0, "removed life at 0/1: OK");
	ok(board.get(1, 0) === 0, "removed life at 1/0: OK");
	ok(board.get(1, 1) === 0, "removed life at 1/1: OK");
});

test("visible rect", function() {
	toggle(9,9);
	toggle(9,10);
	toggle(10,9);
	toggle(10,10);
	
	ok(board.get(9,9), "added life at 9/9: OK");
	ok(board.get(9,10), "added life at 9/100: OK");
	ok(board.get(10,9), "added life at 100/9: OK");
	ok(board.get(10,10), "added life at 100/100: OK");
	
	var cells = board.getAll(visibleRect());
	
	equals(cells.length, 2, cells[0]);
});