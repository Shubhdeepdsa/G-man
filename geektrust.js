const fs = require("fs");

const filename = process.argv[2];

fs.readFile(filename, "utf8", (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    // Parse source and destination coordinates
    const lines = data.trim().split("\n");
    const source = parseCoordinates(lines[0]);
    const destination = parseCoordinates(lines[1]);

    // Calculate power consumption
    const powerConsumption = calculatePower(source, destination);

    // Output remaining power
    
    const remainingPower = 200 - powerConsumption;
    console.log("Remaining Power => ", remainingPower)
});

// Function to parse coordinates from string
function parseCoordinates(str) {
    const [_, x, y, direction] = str.trim().split(" ");
    return { x: parseInt(x), y: parseInt(y), direction };
}

// Function to calculate power consumption
function calculatePower(source, destination) {
    // Implmenting BFS to calculate shortest path
    let queue = [{
        position: source,
        turns: 0,
        moves: 0
    }]
    let visited = new Set();

    while (queue.length > 0) {
        let { position, turns, moves } = queue.shift();
        console.log("Current Position:", position);
        console.log("Turns:", turns);
        console.log("Moves:", moves);
        if (position.x === destination.x && position.y === destination.y) {
            let powerFromMoves = moves * 10;
            let powerFromTurns = turns * 5;
            return powerFromMoves + powerFromTurns;
        }
    
        let neighbours = getNeighbours(position);
        console.log("Neighbours:", neighbours);
        for (let neighbour of neighbours) {
            let key = `${neighbour.x},${neighbour.y}`;
            if (!visited.has(key)) {
                visited.add(key);
                queue.push({
                    position: neighbour,
                    turns: calculateTurns(position, neighbour, source.direction),
                    moves: moves + 1
                });
            }
        }
    }
    // If destination is not reachable
    return -1
}
function getNeighbours(position) {
    let { x, y } = position;
    let neighbours = [
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
        { x, y: y + 1 }
    ].filter(neighbour => isValid(neighbour));
    console.log("Neighbours:", neighbours);
    return neighbours;
}
function isValid(position) {
    let { x, y } = position;
    return x >= 0 && x < 6 && y >= 0 && y < 6; // Check if x and y are within the grid boundaries
}
function calculateTurns(source, destination, direction) {
    // Define the directions in clockwise order
    const directions = ["N", "E", "S", "W"];

    // Find the index of the source direction in the clockwise order
    const sourceIndex = directions.indexOf(direction);

    // Calculate the target direction using the slope between source and destination
    let targetDirection;
    if (source.x === destination.x) {
        targetDirection = destination.y > source.y ? "S" : "N";
    } else {
        targetDirection = destination.x > source.x ? "E" : "W";
    }

    // Find the index of the target direction in the clockwise order
    const targetIndex = directions.indexOf(targetDirection);

    // Calculate the number of clockwise and counterclockwise turns
    let clockwiseTurns = (targetIndex - sourceIndex + 4) % 4;
    let counterclockwiseTurns = (sourceIndex - targetIndex + 4) % 4;

    // Choose the minimum number of turns
    return Math.min(clockwiseTurns, counterclockwiseTurns);
}
