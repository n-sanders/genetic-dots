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
    
    // Display information
    fill(0);
    textSize(16);
    textAlign(LEFT);
    text(`Generation: ${population.gen}`, 10, 30);
    text(`Brain Size: ${population.dots[0].brain.length} steps`, 10, 50);
    text(`Best Fitness: ${population.bestFitness.toFixed(4)}`, 10, 70);
    
    // Display color legend
    text('Colors:', 10, height - 80);
    fill(255); // White
    ellipse(30, height - 60, 8, 8);
    fill(0);
    text('Current', 45, height - 55);
    
    fill(0); // Black
    ellipse(30, height - 40, 8, 8);
    text('Best', 45, height - 35);
    
    fill(255, 255, 0); // Yellow
    ellipse(30, height - 20, 8, 8);
    text('Previous Best', 45, height - 15);
    
    // If all dots are dead or reached goal
    if (population.allDotsDead()) {
        population.calculateFitness();
        population.naturalSelection();
        population.mutateBabies();
    }
}
