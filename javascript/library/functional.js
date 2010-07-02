function map(func, array)
{
	var newArray = new Array(array.length);
	
	for (var i = 0; i < array.length; i++)
	{
		newArray.push(func(array[i]));
	}
	
	return newArray;
}