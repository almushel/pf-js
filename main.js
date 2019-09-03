let mouseHeld = false,
    mouseX = mouseY = null;

const C_WIDTH = 800;
const C_HEIGHT = 600;
const TILE_W = 50;
const TILE_H = 50;
const GRID_COLS = C_WIDTH / TILE_W;
const GRID_ROWS = C_HEIGHT / TILE_H;

let pathStart = 88;
let draggingStart = false;

let canvas, ctx,
    grid = [],
    cameFrom = [],
    pathFound = [];

window.onload = function() {
    canvas = document.getElementById('gridCanvas');
    ctx = canvas.getContext('2d');
    initMouse();
    generateGrid();
    breadthFirstSearch(pathStart, grid);
    update();
}

function update() {
    drawGrid();
    
    drawCameFrom();
    drawPathFound();
    drawMouseTile();
    requestAnimationFrame(update);
}

function generateGrid() {
    let index = 0;
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            if (col == 0 || col == GRID_COLS - 1) {
                grid[index] = 1;
            } else if (row == 0 || row == GRID_ROWS - 1) {
                grid[index] = 1;
            } else {
                grid[index] = 0;
            }
            index++;
        }
    }
}

function breadthFirstSearch(start, graph) {
    let frontier = [];
    frontier.push(start);

    //let cameFrom = [];
    cameFrom.length = graph.length;
    cameFrom.fill(-1);
    cameFrom[start] = null;

    while (frontier.length > 0) {
        let current = frontier[0],
            currentNeighbors = getNeighbors(current, graph);

        for (let i = 0; i < currentNeighbors.length; i++) {
            if (cameFrom[currentNeighbors[i]] === -1) {
                frontier.push(currentNeighbors[i]);
                cameFrom[currentNeighbors[i]] = current;
            }
        }
        frontier.shift();
    }
}

function getPath(goal, start, searchGraph) {
    let current = goal;
        path = [];

    while (current != start) {
        path.push(current);
        current = searchGraph[current];
    }
    //path.push(start);

    return path;
}

function getNeighbors(index, grid) {
    let neighbors = [];

    //One tile to the left
    if ((index % GRID_COLS) - 1 >= 0) {
        neighbors.push(index - 1);
    }
    //One row above
    if (index - GRID_COLS >= 0) {
        neighbors.push(index - GRID_COLS)
    }
    //One tile to the right
    if ((index % GRID_COLS) + 1 < GRID_COLS) {
            neighbors.push(index + 1);
        }
    //One row below
    if (index + GRID_COLS < grid.length) {
        neighbors.push(index + GRID_COLS)
    }
    return neighbors;
}

function drawGrid() {
    ctx.fillStyle = 'dimgrey';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let index = 0;
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            if (index == pathStart) {
                ctx.fillStyle = 'purple';
                ctx.fillRect(col * TILE_W + 1, row * TILE_H + 1, TILE_W - 2, TILE_H - 2);
            } else if (grid[index] == 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(col * TILE_W + 1, row * TILE_H + 1, TILE_W - 2, TILE_H - 2);
            }

            ctx.fillStyle = 'white';
            ctx.font = 'Arial 30px';
            ctx.textAlign = 'center';
            let tX = (col * TILE_W + 1) + (TILE_W - 2) / 2,
                tY = (row * TILE_H + 1) + (TILE_H - 2) / 2;

            ctx.fillText(index, tX, tY);

            index++;
        }
    }
}

function drawCameFrom() {
    let index = 0;
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            if (cameFrom[index] >= 0 && cameFrom[index] !== null) {
                ctx.fillStyle = 'green';
                ctx.fillRect(col * TILE_W + 1, row * TILE_H + 1, TILE_W - 2, TILE_H - 2);

                ctx.fillStyle = 'yellow';
                ctx.font = 'Arial 30px';
                ctx.textAlign = 'center';
                let tX = (col * TILE_W + 1) + (TILE_W - 2) / 2,
                    tY = (row * TILE_H + 1) + (TILE_H - 2) / 2;
    
                ctx.fillText(cameFrom[index], tX, tY);
            }

            index++;
        }
    }
}

function drawPathFound() {
    ctx.fillStyle = 'teal';
    for (let i = 0; i < pathFound.length; i++) {
        if (i == 1) {
            ctx.fillStyle = 'orange';
        }

        let col = pathFound[i] % GRID_COLS,
            row = Math.floor(pathFound[i] / GRID_COLS);
        ctx.fillRect(col * TILE_W, row * TILE_H, TILE_W, TILE_H);
    }
}

function drawMouseTile() {
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.rect(mouseX - (mouseX % TILE_W), mouseY - (mouseY % TILE_H), TILE_W, TILE_H);
    ctx.stroke();
}

function initMouse() {
    canvas.addEventListener('mousemove', updateMousePos)
    document.addEventListener('mousedown', updateMousedown);
    document.addEventListener('mouseup', updateMouseup);
}

function updateMousePos(e) {
    mouseX = e.clientX - canvas.getBoundingClientRect().left;
    mouseY = e.clientY - canvas.getBoundingClientRect().top;

    let mouseCol = Math.floor(mouseX / TILE_W),
        mouseRow = Math.floor(mouseY / TILE_H),
        gIndex = (mouseRow * GRID_COLS) + mouseCol;

    if (draggingStart == true && gIndex != pathStart) {
        pathFound.length = 0;
        pathStart = gIndex;
        breadthFirstSearch(pathStart, grid);
    }
}

function updateMousedown(e) {
    mouseHeld = true;

    let mouseCol = Math.floor(mouseX / TILE_W),
        mouseRow = Math.floor(mouseY / TILE_H),
        gIndex = (mouseRow * GRID_COLS) + mouseCol;

    if (gIndex == pathStart) {
        draggingStart = true;
    }
}

function updateMouseup(e) {
    mouseHeld = false;

    if (draggingStart) {
        draggingStart = false;
    } else {
        let mouseCol = Math.floor(mouseX / TILE_W),
            mouseRow = Math.floor(mouseY / TILE_H),
            gIndex = (mouseRow * GRID_COLS) + mouseCol;
    
        pathFound = getPath(gIndex, pathStart, cameFrom);
    }


}