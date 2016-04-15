//-------------------//
// Path Construction //
//-------------------//

function PathConstruction(transitionStates) {
	
	var tempStates = transitionStates;
	tempStates = matrixToArray(tempStates);

	//THis array contains all of the states of the FA (non repeated) 
	this.states = [];
	this.states = removeDups(tempStates);

	this.init();
}

PathConstruction.prototype.init = function() {
/*
	var nStates = this.states.length;

	for (var i = 0; i < nStates; i++) {
		for (var j = 0; j < nStates; j++) {
			R[i][j][0] = value;
		}
	}
	*/
};


