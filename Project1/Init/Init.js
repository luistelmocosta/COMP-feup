/*
######################################################################
                               Init
######################################################################
*/

function Init() {
	var parser = new FAParser();
};

// --------------
// Auxiliar Funcs 
// --------------

function openExplorer() {
  getElement('dotFile').click();
  getElement('dotFile').addEventListener('change', readFile, false);
};

function About() {
  alert("Developed by Alexandre Ribeiro, João Sousa & Luís");
};

//This function converts a 2d array (matrix) into a 1d array
function matrixToArray(array2D) { 
	var array1D = [];
	var length = array2D.length;
	for (var i = 0; i < length; i++) {
		var length2 = array2D[i].length;
		for (var j = 0; j < length2; j++) {
			array1D.push(array2D[i][j]);
		}
	}
	return array1D;
}

//Removes duplicated elements from an array
function removeDups(array) {
    var seen = {};
    return array.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

//Initializes multidimensional array (Ex. createArray(10,10,10);  createArray(2,4,3,1))
function createArray(length) {
  var arr = new Array(length || 0),
      i = length;

  if (arguments.length > 1) {
    var args = Array.prototype.slice.call(arguments, 1);
    while(i--) arr[i] = createArray.apply(this, args);
  }        
  return arr;
 }