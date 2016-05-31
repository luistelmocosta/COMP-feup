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

	this.checkDirectTransitions(this.states);		
};

//This prototype checks whether there is a direct transition between 2 states (state1 and state2)
//And returns the symbol associated
PathConstruction.prototype.checkDirectTransitions = function(statesArr) {

	var length = statesArr.length;
	var arr = [];
	for (var i = 0; i < length; i++) {
		for (var j = 0; j < length; j++) arr.push(this.aux(statesArr[i], statesArr[j]));
	}

	console.log(arr);
};

PathConstruction.prototype.aux = function(state1, state2) {

	var length = this.singleTransitionsStates.length;

	var match = 0;
	var arr = [];
	var dirTrans = 'null';

	console.log(state1 + ' - ' + state2);

	var s1, s2, symbol;

	var length = this.singleTransitionsStates.length;
	for (var i = 0; i < length; i++) {
		
		var transition = this.singleTransitionsStates[i]; //[state1, state2, symbol]
		s1 = transition[0], s2 = transition[1], symbol = transition[2];

		if (state1 == s1 && state2 == s2) {
			match = 1;
			if (state1 != state2) dirTrans = symbol; 			
			else dirTrans = 'EPSI + ' + symbol;
		} 
		if (match) break;
	}

	if (!match && state1 == state2) dirTrans = 'EPSI';

	console.log(dirTrans);
	return dirTrans;
};


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