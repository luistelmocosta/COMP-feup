/*
######################################################################
						   PathConstruction
######################################################################
*/

function PathConstruction(transitionStates, singleTransitionsStates) {

	this.transitionStates = transitionStates;
	this.singleTransitionsStates = singleTransitionsStates;

	this.init();

	//Generate final unfolded string
	new TreeStr(this.finalPathStr);
};

PathConstruction.prototype.init = function() {

	//THis array contains all of the states of the FA (non repeated) 
	this.states = [];
	this.states = removeDups(matrixToArray(this.transitionStates));

	//Generating final expression string
	this.generateFinalPathStr();

	for (var i = 0; i < this.states.length; i++) {
		for (var j = 0; j < this.states.length; j++) {
			//console.log('Comparing states ' + this.states[i] + ' and ' + this.states[j]);
			//console.log(this.checkDirectTransitions(this.states[i], this.states[j]));
		}
	}

	console.log(this.singleTransitionsStates);
};

//This prototype checks whether there is a direct transition between 2 states (state1 and state2)
//And returns the symbol associated
PathConstruction.prototype.checkDirectTransitions = function(state1, state2) {

	//console.log(this.states);

	var length = this.singleTransitionsStates.length;

	for (var i = 0; i < length; i++) {
		
		var transition = this.singleTransitionsStates[i];
		if (transition[0] == state1 && transition[1] == state2) {
			if (state1 == state2) {
				return ('EPSILON + ' + transition[2]);
			}
			else {
				return transition[2];
			}
		}
		else {
			if (state1 == state2) {
				return 'EPSILON';
			}
		} 
	}

	return 'null'
};

PathConstruction.prototype.checkDirectTransitions2 = function(state1, state2) {}



//To calculate the final regular expression we only need to calculate:
//R[number of states][initial state][final state 1] + R[number of states][initial state][final state 2] + (...)
//The final expression is obtained by the transitions between initial and final states
PathConstruction.prototype.generateFinalPathStr = function() {

	this.finalPathStr = '';
	var k = this.states.length; //number of states

	var I = 0, F = [], E = 0; //I - Initial; F - Final; E - Both
	for (var i = 0; i < k; i++) {

		var state = this.states[i].charAt(0); //Getting only first char of the state name (since we can have I1, I2, IF3, F2, etc)

		switch (state) {
			case 'I':
				I = i + 1;
				break;
			case 'F':
				F.push(i + 1);
				break;
			case 'E':
				F.push(i + 1);
				E = i + 1;
				break;
			default:
				break;
		}
	} 

	var length = F.length;
	if (I != 0) 
		for (var i = 0; i < length; i++) this.finalPathStr += this.Rify(k, I, F[i]);
	else 
		for (var i = 0; i < length; i++) this.finalPathStr += this.Rify(k, E, F[i]);
};

PathConstruction.prototype.Rify = function(k,i,j) {

	return str = 'R[' + k + '][' + i + '][' + j + ']';
};