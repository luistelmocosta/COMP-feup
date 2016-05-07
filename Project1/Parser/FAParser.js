//-----------//
// FA PARSER //
//-----------//

//FAParser parses the .dot expression inserted by the user 
//by validating it's syntax (Viz.js) and initial and termination states
function FAParser() {

  //Clearing display
  getElement("FADisplayer").innerHTML = "";
  getElement("statesWeightDisplayer").style = null;

  this.validFA = 0;
  this.init();
};

//Initializing elements
FAParser.prototype.init = function() {

  var content = getElement("frm1");

  //FAdot stores the FA input by the user
  this.FAdot = content.elements[0].value;

  //Initializing states counter
  this.inStates = 0, this.finStates = 0, this.inFinStates = 0, this.neutralStates = 0;

  this.parseStates();
  if (this.FA_lexicalAnalysis()) //Validating states' names
    if (this.FA_semanticAnalysis()) //Validating number of initial and final states
      if (this.FA_syntaticAnalysis()) { //Viz analysis, mostly syntatical
        this.validFA = 1;
        this.initTransitionSymbols();
      }

  if (!this.validFA) getElement("FADisplayer").innerHTML = "Incorrect Syntax or Number Of Initial/Termination States";
};

//This prototype creates an array (this.transitionStates) with each state inserted by the user
FAParser.prototype.parseStates = function() {

  //Spliting each FA's expression (q0 -> q1; q1 -> q2) - 2 expressions
  var expressionsArray = this.FAdot.split(';');

  //Storing the FA states in an array
  //Ex: q0 -> q1; q0->q2 : this.transitionStates = [["q0 ", " q1"], [" q0", "q2"]
  //(Notice the white spaces due to input's format)
  this.transitionStates = [];
  var length = expressionsArray.length;
  for (var i = 0; i < length; i++) {
    this.transitionStates.push(expressionsArray[i].split('->'));
  }

  var state;
  var length2 = this.transitionStates.length;
  for (var i = 0; i < length2; i++) {

    //Number of states per expression: 
    //Ex. 2 expressions [q0 -> q1; q0 -> q2 -> q3) - (2 and 3 states, respectively)
    var numOfStates = this.transitionStates[i].length;

    for (var j = 0; j < numOfStates; j++) {
      //Removing white spaces from states' array values: 
      //Ex. this.transitionStates = ['q0 ', 'q1 ', ' q2 '] => this.transitionStates formated = ['q0', 'q1', 'q2']
      state = this.transitionStates[i][j].trim();
      this.transitionStates[i][j] = state;
    }
  }
};

FAParser.prototype.FA_lexicalAnalysis = function() {

  //Regex for each type of state (neutral, initial, final, initial/final)
  var neutralRegex = /^[A-EJ-ZGH][a-zA-Z0-9]*$/;
  var inRegex = /^I[0-9]*$/;
  var finRegex = /^F[0-9]*$/;
  var inFinRegex = /^IF[0-9]*$/;

  var nonRepeatedStates = removeDups(matrixToArray(this.transitionStates)); //Reducing overhead

  for (var i = 0; i < nonRepeatedStates.length; i++) {
    var state = nonRepeatedStates[i];
    //Testing states' names using regex's
    if (!inRegex.test(state))
        if (!inFinRegex.test(state))
          if (!finRegex.test(state))
            if (!neutralRegex.test(state)) 
              return false;
  }
  return true;
};

//This prototype checks whether the Initiation/Termination states were correctly inserted
FAParser.prototype.FA_semanticAnalysis = function() {

  var statesArray = matrixToArray(this.transitionStates); //Contains repeated states
  
  var inStatesArray = [];
  var inFinalStatesArray = [];

  //Pushing initial and inFinal states to each array
  for (var i = 0; i < statesArray.length; i++) {
    if (statesArray[i].charAt(0) == 'I')
      if (statesArray[i].charAt(1) == 'F')
        inFinalStatesArray.push(statesArray[i]);
      else inStatesArray.push(statesArray[i]);
  }

  //Counting the number of each states mentioned above (there must be only 1 initial OR 1 inFinal state)
  inStatesArray = removeDups(inStatesArray);
  inFinalStatesArray = removeDups(inFinalStatesArray);
  if (inStatesArray.length == 1 && inFinalStatesArray.length == 0) return true;
  else if (inStatesArray.length == 0 && inFinalStatesArray.length == 1) return true;

  return false;
};

//This prototype checks if the FA syntax is correct using Viz.js
FAParser.prototype.FA_syntaticAnalysis = function() {

  //Creating FA's string for Viz to parse
  var dotStr = "digraph g {" + this.FAdot + ";}";
  var FAInterface = Viz(dotStr);

  if (FAInterface != -1) return true;
  else return false;
};

//This prototype initializes the transitions' symbols related elements 
FAParser.prototype.initTransitionSymbols = function() {

  //Displaying "weights' div" after button is clicked
  var transitionsDiv = getElement('statesWeightDisplayer');
  transitionsDiv.innerHTML = "";
  transitionsDiv.style.display = "block";

  var weightInputTitle = document.createElement("h1");
  weightInputTitle.appendChild(document.createTextNode("Transitions' symbols"));
  transitionsDiv.innerHTML = "<br>";
  transitionsDiv.appendChild(weightInputTitle);

  var inputFields = this.drawTransitions(transitionsDiv);
  transitionsDiv.innerHTML += "<br> <br>";

  this.parseTransitionSymbols(inputFields);
};

//This prototype draws the states' transitions on the screen so the user can insert the symbols
//Also creates a vector with the input values
FAParser.prototype.drawTransitions = function(transitionsDiv) {

  var inputFieldsCounter = 1; var inputFields = [];
  var length = this.transitionStates.length;
  for (var i = 0; i < length; i++) {

    var numOfStates = this.transitionStates[i].length;
    for (var j = 0; j < numOfStates - 1; j++) {

      var transition;
      //&#8594 code for "->"; Displaying the transitions so user can insert paths' weights:
      //Ex. q0 -> q1 Weight:___
      transition = "<br>" + this.transitionStates[i][j] + " &#8594 " + this.transitionStates[i][j + 1] + " ";

      //Creating input field for each path (transition)
      var weightInputField = document.createElement("input");
      weightInputField.id = "weightInput" + inputFieldsCounter;
      weightInputField.className = "weight";

      inputFields.push(weightInputField);
      inputFieldsCounter++;
      
      //Adding transitions and input fields to the html content
      transitionsDiv.innerHTML += transition;
      transitionsDiv.appendChild(weightInputField);
    }
  }
  return inputFields;
};

//This prototype makes the transition from the transition symbols' input table to the FA displayer with the correct symbols
FAParser.prototype.parseTransitionSymbols = function(inputFields) {

  //Creating confirm button
  var confirmBtn = document.createElement("input");
  confirmBtn.type = "button";
  confirmBtn.id = "confirmBtn"
  confirmBtn.value = "Confirm";

  //Saving parser (object) to a global variable so we can use it within onclick
  var parser = this;
  //Handling user's input (after button clicked)
  confirmBtn.onclick = function() {

    var symbolsRegex = /^[^A-Z]*$/;
    var validInput = 1;
    var length = inputFields.length;
    //Saving input to an array (inputFields.value = [weight1, weight2, (...)])
    for (var i = 0; i < length; i++) {

      var weightInput = getElement(inputFields[i].id).value; 
      if (symbolsRegex.test(weightInput)) inputFields[i].value = weightInput;
      else validInput = 0;
    }

    if (validInput) {
      //Creating new string (.dot) so we can redraw the FA with the weights inserted by the user
      //Ex. Weight(transition(q0->q1)) = a // .dot: q0->q1[label=a]
      var inputIndex = 0, str = "";
      var length2 = parser.transitionStates.length;
      for (var i = 0; i < length2; i++) {
        var numOfStates = parser.transitionStates[i].length;
        for (var j = 0; j < numOfStates - 1; j++) {
          str += parser.transitionStates[i][j] + "->" + parser.transitionStates[i][j + 1] + "[label=" + inputFields[inputIndex].value + "]" + ";";
          inputIndex++;
        }
      }

      //Removing last character (";") from the .dot expression
      var formatedStr = str.substring(0, str.length-1);

      //Creating new FA interface including transition weights
      var newDotStr = "digraph g {" + formatedStr + ";}";
      getElement("FADisplayer").innerHTML = "<br> <br>";
      getElement("FADisplayer").innerHTML += Viz(newDotStr);
    }
    else getElement("FADisplayer").innerHTML = "Invalid transition symbol(s)";

    //Initiating Path Construction algorithm
    var singleTransitionsStates = parser.createSingleTransArray(inputFields);
    new PathConstruction(parser.transitionStates, singleTransitionsStates);
  };

  getElement("statesWeightDisplayer").appendChild(confirmBtn);
};

//This prototype creates an array with each transition's symbol and states (useful for PC)
//this.singleTransitionsArray = [[state1, state2, symbol1], [state2, state3, symbol2], (...)]
FAParser.prototype.createSingleTransArray = function(inputFields) {

  var singleTransitionsStates = [];
  var length = this.transitionStates.length;
  var inputIndex = 0;
  
  for (var i = 0; i < length; i++) {
    var numOfStates = this.transitionStates[i].length;
    for (var j = 0; j < numOfStates - 1; j++) {

      var tempArray = []; 
      tempArray.push(this.transitionStates[i][j]);
      tempArray.push(this.transitionStates[i][j + 1]);
      tempArray.push(inputFields[inputIndex].value);
      
      singleTransitionsStates.push(tempArray);

      inputIndex++;
    }
  }
  return singleTransitionsStates;
};

//-----------------//
// Other Functions //
//-----------------//
function getElement(elem) {
  return document.getElementById(elem);
}

function readFile(event) {

    getElement("FADisplayer").innerHTML = "";
    getElement("statesWeightDisplayer").style = null;

    //Getting first file selected
    var file = event.target.files[0]; 

    if (file) {

      //Reading input file
      var reader = new FileReader();

      reader.onload = function(event) {

        if (file.type == "text/plain") { //|| file.type == "application/msword" (dot file)
          //Displaying file content on "dotInp" input
          var contents = event.target.result;
          getElement('dotInp').value = contents;
        }
        else {
          getElement('dotInp').value = "";
          getElement("statesWeightDisplayer").style = "block";
          getElement("FADisplayer").innerHTML = "Incorrect file type";
        }
      }
      
      reader.readAsText(file);
    } 
    else alert("Failed to load file");
};