

class Cell {
    constructor(position, element) {
        this.position = position; //its position inside the parent element
        this.element = element; //the div.cell element which it corresponds too
        this.type = "";     //the icon that hides-will also get a class from this
        this.matched = false; //when the player matches it will be set to true
    }

    setType(type) {
        this.type = type;
        this.element.classList.add(type);
    }

    hide() {
        this.element.classList.add("hidden"); //hide the icon by adding .hidden
    }

    show() {
        this.element.classList.remove("hidden");
    }
}


const levels = {

    background: ["pink", "teal", "rgb(138, 50, 50)"],
    cells: [12, 16, 20]

}



const gameBox = document.querySelector(".game-box");
// const gameCell = document.querySelectorAll(".cell"); //list with all the cells
const gameIntro = document.querySelector(".game-intro");
const playButton = document.querySelector(".play-button");
const gameOverScreen = document.querySelector(".game-over");
const nextBtn = document.querySelector(".next-btn");
const gameArea = document.querySelector(".game-area");
var timer = 0;





let previousCells = [{}, {}];  //here we store the last 2 revealed cell so we can make comparisons
let revealedCount = 0; //here we store how many are revealed
let matchedCount = 0; //counts how many cells are matched
let goal = 0; //how many matches we need to win depends on level
let currentLevel = 0;

//we store our cell objects in this array
const typesArray = ["hearts", "spades", "clubs", "diamonds", "orange", "mushroom", "sword", "horse", "sun", "moon"]







playButton.addEventListener("click", startGame);
//the event is added on tha parent and we use event propogation
gameBox.addEventListener("click", reveal);
nextBtn.addEventListener("click", nextLevel);



function startGame() {
    currentLevel = 1;
    initialise(currentLevel);
    gameIntro.style.animation = "for-game-intro 1.5s ease-in forwards";
    gameBox.style.animation = "for-game-box 1.5s ease-in forwards";
}

// function that initiases our cell objects
function initialise(level) {

    console.log(level);
    previousCells = [{}, {}];
    revealedCount = 0;
    matchedCount = 0;
    myCells = [];
    timer = new Date();

    goal = levels.cells[level - 1] / 2;

    //auxillary array used to give type-classes to our cells
    let classArray = [...typesArray];
    classArray = classArray.splice(0, levels.cells[level - 1] / 2);
    classArray = classArray.concat(classArray);

    for (let i = 0; i < levels.cells[level - 1]; i++) {

        let newCell = document.createElement("div");

        newCell.className = "cell hidden";


        gameBox.appendChild(newCell);

        myCells[i] = new Cell(i, newCell);

        //randomly get an index which will correspond to the class we will pull from tha auxArray
        let classIndex = Math.floor(Math.random() * classArray.length)
        myCells[i].setType(classArray[classIndex]);
        classArray.splice(classIndex, 1);


    }

    gameBox.className = `game-box level-${level}`
    gameBox.parentElement.style.backgroundColor = levels.background[level - 1];

}

function nextLevel(evt) {

    while (gameBox.firstChild) {
        gameBox.removeChild(gameBox.lastChild);
    }
    console.log(this);
    this.parentNode.style.display = "none";
    gameBox.style.opacity = "1";
    initialise(++currentLevel);

}

///THIS FUNCTIONS NEEDS FIXING
// function reset() {

//     //reset the classes of the cells
//     gameCell.forEach(function (cell) {
//         console.log(this);
//         cell.className = "cell hidden";
//     })
//     initialise();

//     this.parentNode.style.display = "none";
// }

//most of the game functionality is here, everything happens when we click the cells
function reveal(evt) {


    if (evt.target == gameBox) {
        return;
    }

    //get the order/position of the element clicked
    let order = Array.prototype.indexOf.call(evt.target.parentNode.children, evt.target);


    //if its found ignore the event
    if (myCells[order].matched) return;
    //if its allready revaled ignore the event
    if (!myCells[order].element.classList.contains("hidden")) return;
    console.log("event fired");

    myCells[order].show();

    //if a cell was clicked previosly
    if (revealedCount === 0) {
        previousCells[0] = myCells[order];
        revealedCount++;
        console.log("first cell")
    }
    else if (revealedCount === 1) {
        if (previousCells[0].type === myCells[order].type) {
            console.log("previous  match")
            previousCells.matched = true;
            myCells[order].matched = true;
            previousCells[0] = {};
            revealedCount = 0;
            if (++matchedCount == goal) {
                console.log("YOU WIN!!")
                gameOver("win");
            }
        }
        else {//no match
            console.log("previous no match")
            previousCells[1] = myCells[order];
            revealedCount++;
        }
    }
    else {//2 allready revealed
        console.log("hid the last 2")
        previousCells[0].hide();
        previousCells[1].hide();
        previousCells[0] = myCells[order];
        previousCells[1] = {};
        revealedCount = 1;

    }
}

function gameOver(result) {
    gameBox.style.opacity = "0.5"
    gameOverScreen.style.display = "initial";
    gameOverScreen.childNodes[1].innerHTML = `LEVEL ${currentLevel} COMPLETE`
    if (currentLevel == 3) {
        gameOverScreen.childNodes[1].innerHTML = `GAME OVER`
        gameOverScreen.childNodes[1].style.top = "50%"
        nextBtn.style.display = "none";
    }
}


//this is used in the console for debugging
function revealAll() {
    myCells.forEach(function (cell) {
        cell.show();

    })
    gameOver("debug");

}
