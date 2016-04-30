//-------------------//
// Path Construction //
//-------------------//

function PathConstruction(transitionStates, singleTransitionsStates) {

	this.transitionStates = transitionStates;
	this.singleTransitionsStates = singleTransitionsStates;

	//THis array contains all of the states of the FA (non repeated) 
	this.states = [];
	this.states = removeDups(matrixToArray(transitionStates));

	this.init();
};

PathConstruction.prototype.init = function() {

	var nStates = this.states.length;

	//R[k][i][j]
	this.R = createArray(nStates, nStates, nStates);
	console.log(this.checkTransition('F', 'A'));
	//Initializing values for k = 0
	for (var i = 0; i < nStates; i++) {
		for (var j = 0; j < nStates; j++) {
			//if (checkTransition(i,j)) {
				//R[0][i][j] = symbol
			//}
		}
	}
};

//This prototype checks whether there is a direct transition between 2 states (state1 and state2)
//And returns the symbol associated
PathConstruction.prototype.checkTransition = function(state1, state2) {

	var length = this.singleTransitionsStates.length;
	for (var i = 0; i < length; i++) {
		var transition = this.singleTransitionsStates[i];
		if (transition[0] == state1 || transition[1] == state1)
			if (transition[0] == state2 || transition[1] == state2)
				return transition[2]; //returns symbol if there's a direct transition between symbols
	}
	return -1;
};


