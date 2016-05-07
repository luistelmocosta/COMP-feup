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
	
	//Initializing values for k = 0
	for (var i = 0; i < nStates; i++) {
		for (var j = 0; j < nStates; j++) {
			//console.log("State " + this.states[i] + " to State " + this.states[j] + " = " + this.checkTransition(this.states[i], this.states[j]));
			this.R[0][i][j] = this.checkDirectTransitions(this.states[i], this.states[j]);
		}
	}
	this.calculateFinalExpression();
};

//To calculate the final regular expression we only need to calculate:
//R[number of states][initial state][final state 1] + R[number of states][initial state][final state 2] + (...)
//The final expression is obtained by the transitions between initial and final states
PathConstruction.prototype.calculateFinalExpression = function() {

	var nStates = this.states.length;
	//var finExp = R[nStates][][];

	var k = nStates;
	var initS = -1; //Initial state
	var finS = []; //Final state(s)
	var inFinS = -1; //Initial and final state

	for (var i = 0; i < nStates; i++) {

		var state = this.states[i].charAt(0); //Getting only first char of the state name (since we can have I1, I2, IF3, F2, etc)
		switch (state) {
			case 'I':
				if (this.states[i].charAt(1) == 'F') inFinS = i + 1;
				else initS = i + 1;
				break;
			case 'F':
				finS.push(i + 1);
				break;
			default:
				break;
		}
	}

	var str = "Final Expression = ";
	if (initS != -1) 
	{
		var fLength = finS.length;
		if (fLength > 1) {
			for (var i = 0; i < fLength; i++) {
				str += 'R[' + k + ']' + '[' + initS + ']' + '[' + finS[i] + '] + ';
			}
		}
		else str += 'R[' + k + ']' + '[' + initS + ']' + '[' + finS + '] + ';
	}
	else 
	{
		var fLength = finS.length;
		if (fLength > 0) {
			str += 'R[' + k + ']' + '[' + inFinS + ']' + '[' + inFinS + '] + ';
			for (var i = 0; i < fLength; i++) {
				str += 'R[' + k + ']' + '[' + inFinS + ']' + '[' + finS[i] + '] + ';
			}
		}
		else str += 'R[' + k + ']' + '[' + inFinS + ']' + '[' + inFinS + ']';
	}

	console.log(str);
};

//This prototype checks whether there is a direct transition between 2 states (state1 and state2)
//And returns the symbol associated
PathConstruction.prototype.checkDirectTransitions = function(state1, state2) {

	var length = this.singleTransitionsStates.length;
	for (var i = 0; i < length; i++) {
		var transition = this.singleTransitionsStates[i];
		if (transition[0] == state1 && transition[1] == state2)
			if (state1 == state2)
				return 'EPSILON + ' + transition[2];
			else return transition[2]; //returns symbol if there's a direct transition between states
	}
	return 'EPSILON';
};


