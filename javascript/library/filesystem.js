/* File Loading */

//http://stackoverflow.com/questions/3146483/html5-file-api-read-as-text-and-binary
function FileSystem(){
	var that = this;
	var reader;
	var progress = document.querySelector('.percent');

	function isFileLoadingSupported()
	{
		// Check for the various File API support.
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			return true;
		} else {
			alert('The File APIs are not fully supported in this browser.');
			return false;
		}
	};

	function abortRead() {
		reader.abort();
	};

	function errorHandler(evt) {
		switch(evt.target.error.code) {
		  case evt.target.error.NOT_FOUND_ERR:
			alert('File Not Found!');
			break;
		  case evt.target.error.NOT_READABLE_ERR:
			alert('File is not readable');
			break;
		  case evt.target.error.ABORT_ERR:
			break; // noop
		  default:
			alert('An error occurred reading this file.');
		};
	};

	function updateProgress(evt) {
		// evt is an ProgressEvent.
		if (evt.lengthComputable) {
		  var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
		  // Increase the progress bar length.
		  if (percentLoaded < 100) {
			progress.style.width = percentLoaded + '%';
			progress.textContent = percentLoaded + '%';
		  }
		}
	};
	
	this.handleFileSelect = function(evt){
		// Reset progress indicator on new file selection.
		progress.style.width = '0%';
		progress.textContent = '0%';

		reader = new FileReader();
		reader.onerror = errorHandler;
		reader.onprogress = updateProgress;
		reader.onabort = function(e) {
		  alert('File read cancelled');
		};
		reader.onloadstart = function(e) {
		  document.getElementById('progress_bar').className = 'loading';
		};
		reader.onload = function(e) {
		  // Ensure that the progress bar displays 100% at the end.
		  progress.style.width = '100%';
		  progress.textContent = '100%';
		  setTimeout("document.getElementById('progress_bar').className='';", 2000);
		 processFile(e.target.result);
		}

		// Read in the image file as a binary string.
		reader.readAsText(evt.target.files[0]);
	};
};

/* Process File Format */
function processFile(data){
	var result;
	
	var lines = data.split("\r\n");

	for (var i = 0; i < lines.length; i++)
	{
			if (lines[i][0] === "!" || lines[i][0] === "#")  //remove comment lines
			{
				lines.splice(i,1);
				i--;
			}
	}
	
	if (lines[0][0] === "." || lines[0][0] === "O"){ //we are dealing with raw file format
		lifeGame.loadData(processRawFormat(lines));
	}
	else if (lines[0][0] === "x"){
		lines.splice(0,1); //get rid of the first line
		lifeGame.loadData(processRLE(lines));
	}
	
	function processRawFormat(lines)
	{
		var result = [];
	
		for (var i = 0, len = lines.length; i < len; i++)
		{
			for (var j = 0, arraylen = lines[i].length; j < arraylen; j++)
			{
				if (lines[i][j] === "O"){
					result.push([i,j]);
				}					
			}
		}
		
		return result;
	}
	
	function processRLE(lines)
	{
		var y = 0;
		var x = 0;
		var accum = "0";
		var result = [];
		
		for (var i = 0, len = lines.length; i < len; i++)
		{
			for (var j = 0, arraylen = lines[i].length; j < arraylen; j++)
			{
				if (lines[i][j] === "b"){ //the cell is dead
					var accumValue = parseInt(accum, 10);
					
					if (accumValue === 0){
						x++; //we assume that it is actually +1 according to the rules
					}
					else{
						x += accumValue;
					}
					
					accum = "0";
					
					//x = parseInt(accum, 10);
					//accum = "1";
				}
				else if (lines[i][j] === "o"){ //the cell is alive
					// if (parseInt(accum, 10) === 0)
					// {
						// result.push([x+1, y]);
					// }
					// else
					// {
					var accumValue = parseInt(accum, 10);
					
					if (accumValue === 0)
					{
						x++;
						result.push([x-1,y]);
					}
					else
					{
						for (var k = 1; k <= accumValue; k++){
							result.push([x+k-1, y]);
						}
						
						x += accumValue;
					}
					// }
					accum = "0";
				}
				else if (lines[i][j] === "$"){ //new row
					x = 0;
					y++;
					accum = "0";
				}
				else{
					accum += lines[i][j];
				}
			}
		}
		
		return result;
		
	}
};

