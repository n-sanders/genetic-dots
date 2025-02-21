let population;
let target;
let startPos;

function setup() {
    createCanvas(800, 600);
    startPos = createVector(width/2, height - 20);
    target = createVector(width/2, 20);
    population = new Population(100, startPos.x, startPos.y);
}

function draw() {
    background(220);
    
    // Draw target
    fill(255, 0, 0);
    noStroke();
    ellipse(target.x, target.y, 20, 20);
    
    // Draw start position
    fill(0, 255, 0);
    ellipse(startPos.x, startPos.y, 20, 20);
    
    // Update and show population
    population.update();
    population.show();
    
    // If all dots are dead or reached goal
    if (population.allDotsDead()) {
        population.calculateFitness();
        population.naturalSelection();
        population.mutateBabies();
    }
}
