/*
######################################################################
							 TreeStr
######################################################################

This class initially creates a final expression string with k = n and
replaces the paths with the new unfolded paths until k = 0 
*/

function TreeStr(finalPathStr) {

	this.finalPathStr = finalPathStr;
	this.tree = [];
	this.initTree();
};

TreeStr.prototype.initTree = function() {

	var string = this.finalPathStr;
	var k = string[2];

	while (k != 0) {
		string = this.replaceStr(string);
		k--;
	}
	
	//this.printTree(); TODO
};

TreeStr.prototype.unfoldPath = function(path) {

	var unfoldedPath = '';
	var R0, R1, R2, R3; //New paths 

	var k = path[2];
	var i = path[5];
	var j = path[8];

	//Unfolding path
    //R[k][i][j] = R[k - 1][i][j] + R[k - 1][i][k] (R[k - 1][k][k])* R[k - 1][k][j]
    R0 = 'R[' + (k - 1) + '][' + i + '][' + j + ']';
    R1 = 'R[' + (k - 1) + '][' + i + '][' + k + ']';
    R2 = 'R[' + (k - 1) + '][' + k + '][' + k + ']';
    R3 = 'R[' + (k - 1) + '][' + k + '][' + j + ']';

	return unfoldedPath = '(' + R0 + ' + ' + '(' + R1 + ')' +'.(' + R2 + ')*.' + '(' + R3 + ')' + ')';
}

TreeStr.prototype.replaceStr = function(string) {

	var substring = 'R', path = '';

	//Getting first path starting position
	var pos = string.indexOf(substring);
	var counter = 0;
	var unfPathArr = [];
	while (true) {
	    
		//Getting path (Ex. path = 'R[3][1][3]')
		path = string.substring(pos, pos + 10);

		//Removing path found for further analysis of the string
		var n = 'X' + counter;
		string = string.replace(path, n);
		
		//Updating newStr with the unfolded path
		unfPathArr.push(this.unfoldPath(path));

		counter++;

		//Updating next path starting position
		pos = string.indexOf(substring);
		if (pos == -1) break; //No more paths to unfold, loop finished
	}

	//this.tree.push(unfPathArr); //Pushing paths to the tree

	//Adding new paths to the string
	var length = unfPathArr.length;
	for (var i = 0; i < length; i++) {
		var n = 'X' + i;
		string = string.replace(n, unfPathArr[i]);
	}

	return string;
};

TreeStr.prototype.printTree = function() {
	//console.log(this.tree);
};