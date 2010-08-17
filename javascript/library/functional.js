function map(func, array)
{
	var newArray = new Array(array.length);
	
	for (var i = 0; i < array.length; i++)
	{
		newArray.push(func(array[i]));
	}
	
	return newArray;
}


/*
 * http://stackoverflow.com/questions/122102/what-is-the-most-efficent-way-to-clone-a-javascript-object
 *
 */
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