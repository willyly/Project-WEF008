const unitLength = 20;
const boxColor = 150;
const strokeColor = 50;
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
const sliderElm = document.querySelector("#fr-slider")
const startStopBtn = document.querySelector(`#start-stop-btn`)
let isStart = false
let isColor = false

function setup() {
    frameRate(20)
    /* Set the canvas to be under the element #canvas*/
    const canvas = createCanvas(windowWidth, windowHeight - 100);
    canvas.parent(document.querySelector('#canvas'));

    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
    }
    // Now both currentBoard and nextBoard are array of array of undefined values.
    init();  // Set the initial values of the currentBoard and nextBoard
}

/**
* Initialize/reset the board state
*/
function init() {
    frameRate(20)
    sliderElm.value = 20 
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0;
            // currentBoard[i][j] = random() > 0.8 ? 1 : 0; // one line if
            nextBoard[i][j] = 0;
        }
    }
}

//每秒都行緊十幾次
function draw() {
    background(255);
    generate(); //計算生死法則
    for (let columnX = 0; columnX < columns; columnX++) {
        for (let rowY = 0; rowY < rows; rowY++) {
            if (currentBoard[columnX][rowY] == 1) {
                if(isColor){
                    fill(Math.floor(Math.random() * 50), Math.floor(Math.random() * 50),Math.floor(Math.random() * 240));
                }else{
                    fill(boxColor)
                }
            } else {
                fill(255); //格仔底色
            }
            stroke(strokeColor); 
            rect(columnX * unitLength, rowY * unitLength, unitLength, unitLength);
            //rect方體
        }
    }
}

function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) { //i係＝每一格x軸既打橫
                for (let j of [-1, 0, 1]) { //J係＝每一格Y軸既打直
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                    // console.log(
                    //     "neighbors: ",
                    //     neighbors,
                    //     ", x: ",
                    //     x,
                    //     ", i: ",
                    //     i,
                    //     " columns: ",
                    //     columns,
                    //     ", y: ",
                    //     y,
                    //     ", j: ",
                    //     j,
                    //     ", rows: ",
                    //     rows
                    // );
                }
            }

            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < Number(document.querySelector(`#Loneliness`).value)) { 
                // Die of Loneliness //第1法則
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > 3) {
                // Die of Overpopulation //第2法則
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == 3) {
                // New life due to Reproduction //第4法則
                nextBoard[x][y] = 1;
            } else {
                // Stasis //第3法則
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

/**
 * When mouse is dragged
 */
function mouseDragged() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    fill(boxColor);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed() {
    noLoop();
    mouseDragged();
}

/**
 * When mouse is released
 */
function mouseReleased() {
    loop();
    startStopBtn.innerText = 'Stop' 
}

document.querySelector('#reset-game')
    .addEventListener('click', function () {
        init();
        startStopBtn.innerText = 'Start'
    });

let radios = document.querySelectorAll('input[name = color-mode]')
    for(let radio of radios){
        radio.addEventListener('click',() => {
            console.log(radio.value)
            if(radio.value === 'random'){
                isColor = true
            }else{
                isColor = false
            }
        })
    }

sliderElm.addEventListener("input" ,() => {
let currentValue = sliderElm.value
    console.log(`currentValue = `, currentValue);
    frameRate(Number(currentValue))
})
//click / input 輸入中 /change 已改變 /常用DOM
//-----原版-----
// document.querySelector("#fr-slider").addEventListener("input" ,() => {
//     let currentValue = document.querySelector("#fr-slider").value
//         console.log(`currentValue = `, currentValue);
//         frameRate(Number(currentValue))
// })

startStopBtn.addEventListener(`click`, ()=>{
    isStart = !isStart
    if(isStart){
        noLoop()
        startStopBtn.innerText = 'Start'
    }else{
        loop()
    }
})