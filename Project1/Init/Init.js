function Init() {

	var parser = new FAParser();

	var transitionStates = parser.transitionStates; //May contain repeated states (handled in PC.js)
	new PathConstruction(transitionStates);
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
	for (var i = 0; i < array2D.length; i++) {
		var n = array2D[i].length;
		for (var j = 0; j < n; j++) {
			array1D.push(array2D[i][j]);
		}
	}
	return array1D;
}

function removeDups(array) {
    var seen = {};
    return array.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}