/**
 FAParser parses the .dot expression inserted by the user 
 by validating it's syntax (Viz.js) and initial and termination states
*/
function FAParser() {
  this.validFA = 0;
  this.init();
}

FAParser.prototype.init = function() {

  var content = document.getElementById("frm1");

  //FAdot stores the FA input by the user
  this.FAdot = content.elements[0].value;

  //Spliting each FA's expression (q0 -> q1; q1 -> q2) - 2 expressions
  var expressionsArray = this.FAdot.split(';');

  this.initialStateCounter = 0;
  this.finalStateCounter = 0;
  this.initFinalStateCounter = 0;
  this.validFAStates = 0;

  //Counting states
  this.initFinalStatesCounter(expressionsArray);
  //Validating states
  this.validate_FA_States();
  //Validating FA's syxtax using the "Viz.js" library 
  if (this.validFAStates) this.validate_FA_Syntax();
  else 
    document.getElementById("FADisplayer").innerHTML = "Incorrect number of Initial/Termination states or syntax";
  
  if (this.validFA == 1) this.pathWeight();
};

//This prototype counts how many "Initial", "Final" and "InitFinal" states were inserted by the user
FAParser.prototype.initFinalStatesCounter = function(expressionsArray) {

  //Storing the FA states in an array
  //Ex: q0 -> q1; q0->q2 : this.expressionStates = [["q0 ", " q1"], [" q0", "q2"]
  //(Notice the white spaces due to input's format)
  this.expressionStates = [];
  for (var i = 0; i < expressionsArray.length; i++) {
    this.expressionStates.push(expressionsArray[i].split('->'));
  }

  var state;
  for (var i = 0; i < this.expressionStates.length; i++) {

    //Number of states per expression: 
    //Ex. 2 expressions [q0 -> q1; q0 -> q2 -> q3) - (2 and 3 states, respectively)
    var numOfStates = this.expressionStates[i].length;

    for (var j = 0; j < numOfStates; j++) {

      //Removing white spaces from states' array values: 
      //Ex. this.expressionStates = ['q0 ', 'q1 ', ' q2 '] => this.expressionStates formated = ['q0', 'q1', 'q2']
      state = this.expressionStates[i][j].trim();
      this.expressionStates[i][j] = state;

      switch(state) {
        case "Initial":
            this.initialStateCounter++;
            break;
        case "Final":
            this.finalStateCounter++;
            break;
        case "InitFinal":
            this.initFinalStateCounter++;
            break;
        default:
            break;
      }
    }
  }
};

//This prototype checks whether the Initiation/Termination states were correctly inserted
FAParser.prototype.validate_FA_States = function() {

  //Validating states
  //Checking for 1 Initial and 1 Final state
  if (this.initialStateCounter >= 1 & this.finalStateCounter >= 1 & this.initFinalStateCounter == 0)
    this.validFAStates = 1;
  //Checking for a both Initial and Final state, the rest of the possibilities are discarded for violating FA's rules
  else if (this.initialStateCounter == 0 & this.finalStateCounter == 0 & this.initFinalStateCounter >= 1)
    this.validFAStates = 1;
};

//This prototype checks if the FA syntax is correct using Viz.js
FAParser.prototype.validate_FA_Syntax = function() {

  //Creating FA's string for Viz to interpret
  var dotStr = "digraph g {" + this.FAdot + ";}";

  var FAInterface = Viz(dotStr);

  if (FAInterface == -1)
    document.getElementById("FADisplayer").innerHTML = "Syntax error. Try again.";
  else 
    this.validFA = 1;
};

FAParser.prototype.pathWeight = function() {

  //Making sure the paragraph is empty
  document.getElementById("statesWeightDisplayer").innerHTML = "";

  var weightInputTitle = document.createElement("h1");
  weightInputTitle.appendChild(document.createTextNode("Insert transitions' weight"));
  document.getElementById("statesWeightDisplayer").appendChild(weightInputTitle);

  var inputFieldsCounter = 1; var inputFields = [];
  for (var i = 0; i < this.expressionStates.length; i++) {

    var numOfStates = this.expressionStates[i].length;
    for (var j = 0; j < numOfStates - 1; j++) {

      var transition;
      //&#8594 code for "->"; Displaying the transitions so user can insert paths' weights:
      //Ex. q0 -> q1 Weight:___
      transition = "<br> <br>" + this.expressionStates[i][j] + " &#8594 " + this.expressionStates[i][j + 1] + "<br>"; 

      //Creating input field for each path (transition)
      var weightInputField = document.createElement("input");
      weightInputField.id = "weightInput" + inputFieldsCounter;

      inputFields.push(weightInputField);
      inputFieldsCounter++;
      
      //Adding transitions and input fields to the html content
      document.getElementById("statesWeightDisplayer").innerHTML += transition;
      document.getElementById("statesWeightDisplayer").appendChild(weightInputField);
    }
  }
  document.getElementById("statesWeightDisplayer").innerHTML += "<br>";

  this.handlePathWeights(inputFields);
}


FAParser.prototype.handlePathWeights = function(inputFields) {

  //Creating confirm button
  var confirmBtn = document.createElement("input");
  confirmBtn.type = "button";
  confirmBtn.value = "Confirm";

  //Saving obj array (this.expressionStates) to a variable so we can use manipulate it inside the onclick function
  var expStates = this.expressionStates;
  //Handling user's input (after button clicked)
  confirmBtn.onclick = function() {
    
    //Saving input to an array (inputFields.value = [weight1, weight2, (...)])
    for (var i = 0; i < inputFields.length; i++) {
      var weightInput = document.getElementById(inputFields[i].id).value;
      if (weightInput == "") {
        console.log("Weight cannot be empty");
        break;
      }
      else
        inputFields[i].value = weightInput;
    }

    //Creating new string (.dot) so we can redraw the FA with the weights inserted by the user
    //Ex. Weight(transition(q0->q1)) = a // .dot: q0->q1[label=a]
    var inputIndex = 0;
    var str = "";
    for (var i = 0; i < expStates.length; i++) {
      var numOfStates = expStates[i].length;
      for (var j = 0; j < numOfStates - 1; j++) {
        str += expStates[i][j] + "->" + expStates[i][j + 1] + "[label=" + inputFields[inputIndex].value + "]" + ";";
        inputIndex++;
      }
    }

    //Removing last character (";") from the .dot expression
    var formatedStr = str.substring(0, str.length-1);

    //Creating new FA interface including transition weights
    var newDotStr = "digraph g {" + formatedStr + ";}";
    document.getElementById("FADisplayer").innerHTML = Viz(newDotStr);
  };

  document.getElementById("statesWeightDisplayer").appendChild(confirmBtn);
};
