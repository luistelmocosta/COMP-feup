function Queue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = {};
}
 
Queue.prototype.size = function() {
    return this._newestIndex - this._oldestIndex;
};
 
Queue.prototype.enqueue = function(data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};
 
Queue.prototype.dequeue = function() {
    var oldestIndex = this._oldestIndex,
        newestIndex = this._newestIndex,
        deletedData;
 
    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex];
        delete this._storage[oldestIndex];
        this._oldestIndex++;
 
        return deletedData;
    }
};

function Node(data) {
    this.data = data;
    this.parent = null;
    this.children = [];

    this.R = [];
    this.leaf = 0;
};

Node.prototype.getNode = function(data) {
    if (this.data == data) return this;
};
 
function Tree(data) {
    var node = new Node(data);
    this._root = node;
}
 
Tree.prototype.traverseDF = function(callback) {
 
    // this is a recurse and immediately-invoking function
    (function recurse(currentNode) {
        // step 2
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            // step 3
            recurse(currentNode.children[i]);
        }
 
        // step 4
        callback(currentNode);
 
        // step 1
    })(this._root);
 
};
 
Tree.prototype.add = function(data, toData, traversal) {
    var child = new Node(data),
        parent = null,
        callback = function(node) {
            if (node.data === toData) {
                parent = node;
            }
        };
 
    this.contains(callback, traversal);
 
    if (parent) {
        parent.children.push(child);
        child.parent = parent;
    } else {
        throw new Error('Cannot add node to a non-existent parent.');
    }
};

function unfoldPath2(R) {

    //Path unfolding 
    //R[k][i][j] = R[k - 1][i][j] + R[k - 1][i][k] (R[k - 1][k][k])* R[k - 1][k][j]

    //R[k][i][j]
    var k = R[0];
    var i = R[1];
    var j = R[2];

    /*   ||
        \||/
         \/    */    

    //R[k - 1][i][j]
    var temp1 = [];
    temp1.push(k - 1);
    temp1.push(i);
    temp1.push(j);

    //R[k - 1][i][k]
    var temp2 = [];
    temp2.push(k - 1);
    temp2.push(i);
    temp2.push(k);
    
    //R[k - 1][k][k]
    var temp3 = [];
    temp3.push(k - 1);
    temp3.push(k);
    temp3.push(k);
    
    //R[k - 1][k][j]
    var temp4 = [];
    temp4.push(k - 1);
    temp4.push(k);
    temp4.push(j);

    var arr = [];
    arr.push(temp1);
    arr.push(temp2);
    arr.push(temp3);
    arr.push(temp4);

    console.log('arr = ' + arr[0]);

    return arr;
};

function initTree(finalR) {
    //Fazer aqui depth = 0 e 1 
};

function createTree(finalR) {

    //---------------------------------- DEPTH = 0 (root) -----------------------------------------
    var tree = new Tree('PCTree'); //root_node.data = 'PCTREE'
    

    //------------------------- FINAL EXPRESSION TREE INITIALIZATION ------------------------------ 
    //------------------------------------- DEPTH = 1 ---------------------------------------------
    var RLength = finalR.length;
    for (var i = 0; i < RLength; i++) {

        var Rstr = 'R[' + finalR[i][0] + '][' + finalR[i][1] + '][' + finalR[i][2] + ']';  
        tree.add(Rstr, 'PCTree', tree.traverseDF);
        
        if (i != RLength - 1) tree.add('+', 'PCTree', tree.traverseDF);
    }


    //-------------------------- UNFOLDED PATHS TREE INITIALIZATION ------------------------------- 
    //--------------------------------- DEPTH = 2 -> (k + 1) --------------------------------------

    var k = finalR[0][0];

    for (var i = 0; i < tree._root.children.length; i++) {
        //unfoldPath(tree._root.children[0]);
        //tree.add();
        console.log(tree._root.children[i]);
    }

    for (var i = 2; i <= k + 1; i++) { //tree._root.children = [Node1, Node2,...]

        for (var j = 0; j < tree._root.children.length; j++) {

            //var children = tree._root.children;
            //console.log(children);
        }
    }

    /*
    k--;
    var inc = k; //First level of expanded expressions (after initializing final R)
    while (k != 0) {

        if (k == inc) {

            //for (var i = 0; i < tree._root.children.length; i++) {}
                
                var node = tree._root.children[0];
                //Convert here R(k) into R(k-1)
                unfoldPath(node.R);

                //Fazer adicoes à tree nesta seccao
            //}           
        }


        k--;
    }*/
    
    printLeaves(tree);
}

function printLeaves(tree) {
    //Prints tree leaves
    tree.traverseDF(function(node) {
        if (node.children.length == 0)
            console.log(node.data);
    });
};




    /*
    var nd = new Node('R1');
    tree.add(nd, 'PCTree', tree.traverseDF);
    tree.add('+', 'PCTree', tree.traverseDF);
    tree.add('R2', 'PCTree', tree.traverseDF);
    tree.add('+', 'PCTree', tree.traverseDF);
    tree.add('R3', 'PCTree', tree.traverseDF);

    var nodealpha = new Node('R10');
    tree.add(nodealpha, nd, tree.traverseDF);
    tree.add('R11', 'R2', tree.traverseDF);
    tree.add('R12', 'R3', tree.traverseDF);
    */


    Tree.prototype.traverseBF = function(callback) {
    var queue = new Queue();
 
    queue.enqueue(this._root);
 
    currentTree = queue.dequeue();
 
    while(currentTree){
        for (var i = 0, length = currentTree.children.length; i < length; i++) {
            queue.enqueue(currentTree.children[i]);
        }
 
        callback(currentTree);
        currentTree = queue.dequeue();
    }
};
 
Tree.prototype.contains = function(callback, traversal) {
    traversal.call(this, callback);
};
Tree.prototype.remove = function(data, fromData, traversal) {
    var tree = this,
        parent = null,
        childToRemove = null,
        index;
 
    var callback = function(node) {
        if (node.data === fromData) {
            parent = node;
        }
    };
 
    this.contains(callback, traversal);
 
    if (parent) {
        index = findIndex(parent.children, data);
 
        if (index === undefined) {
            throw new Error('Node to remove does not exist.');
        } else {
            childToRemove = parent.children.splice(index, 1);
        }
    } else {
        throw new Error('Parent does not exist.');
    }
 
    return childToRemove;
};
 
function findIndex(arr, data) {
    var index;
 
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].data === data) {
            index = i;
        }
    }
 
    return index;
}

/*
PathConstruction.prototype.finalPath2 = function() {

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

PathConstruction.prototype.finalPath3 = function() {

    var nStates = this.states.length;
    console.log(this.states);
    //var finExp = R[nStates][][];

    var k = nStates;
    var initS = 0; //Initial state
    var finS = []; //Final state(s)
    var inFinS = 0; //Initial and final state

    for (var i = 0; i < nStates; i++) {

        var state = this.states[i].charAt(0); //Getting only first char of the state name (since we can have I1, I2, IF3, F2, etc)
        switch (state) {
            case 'I':
                if (this.states[i].charAt(1) == 'F') inFinS = 1; else initS = 1;
                break;
            case 'F':
                finS.push(i + 1);
                break;
            default:
                break;
        }
    }

    console.log('initS : ' + initS);
    console.log('inFinS : ' + inFinS);
    console.log('finS : ' + finS);

    var str = "Final Expression = ";

    var arr = createArray(4, 3);
    
    if (initS != -1) 
    {
        if (fLength > 1) {
            for (var i = 0; i < fLength; i++) {
                str += 'R[' + k + ']' + '[' + initS + ']' + '[' + finS[i] + '] + ';
                arr[i][0] = k;
                arr[i][1] = initS;
                arr[i][2] = finS[i];
            }
        }
        else {
            str += 'R[' + k + ']' + '[' + initS + ']' + '[' + finS[0] + '] + ';
            arr[0][0] = k;
            arr[0][1] = initS;
            arr[0][2] = finS[0];
        }
    }
    else 
    {
        var fLength = finS.length;
        if (fLength > 0) {

            str += 'R[' + k + ']' + '[' + inFinS + ']' + '[' + inFinS + '] + ';
            arr[0][0] = k;
            arr[0][1] = inFinS;
            arr[0][2] = inFinS;
            
            for (var i = 0; i < fLength; i++) {
                
                str += 'R[' + k + ']' + '[' + inFinS + ']' + '[' + finS[i] + '] + ';
                arr[i + 1][0] = k;
                arr[i + 1][1] = inFinS;
                arr[i + 1][2] = finS[i];
            }
        }
        else {
            str += 'R[' + k + ']' + '[' + inFinS + ']' + '[' + inFinS + ']';
            arr[0][0] = k;
            arr[0][1] = inFinS;
            arr[0][2] = inFinS;
        }
    }
    
    console.log(str);
    //new TreeStr;
};
*/