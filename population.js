class Population {
    constructor(size, x, y) {
        this.initialBrainSize = 50;  // Start with smaller brain size
        this.brainGrowth = 25;  // How much to grow brain each generation
        this.dots = new Array(size);
        for (let i = 0; i < size; i++) {
            this.dots[i] = new Dot(x, y, this.initialBrainSize);
        }
        this.fitnessSum = 0;
        this.gen = 1;
        this.bestDot = 0;
        this.bestFitness = 0;  // Track best fitness
        this.minStep = Infinity;
    }
    
    show() {
        for (let dot of this.dots) {
            dot.show();
        }
    }
    
    update() {
        for (let dot of this.dots) {
            dot.move();
        }
    }
    
    calculateFitness() {
        for (let dot of this.dots) {
            dot.calculateFitness();
        }
    }
    
    allDotsDead() {
        for (let dot of this.dots) {
            if (!dot.dead && !dot.reachedGoal) {
                return false;
            }
        }
        return true;
    }
    
    naturalSelection() {
        let newDots = new Array(this.dots.length);
        let newBrainSize = this.dots[0].brain.length;
        
        // If any dot reached the goal, keep same brain size
        // Otherwise, increase brain size
        let reachedGoal = false;
        for (let dot of this.dots) {
            if (dot.reachedGoal) {
                reachedGoal = true;
                break;
            }
        }
        
        if (!reachedGoal) {
            newBrainSize += this.brainGrowth;
        }
        
        this.setBestDot();
        this.calculateFitnessSum();
        
        // Clear previous generation's best
        for (let dot of this.dots) {
            dot.isLastGenBest = false;
        }
        
        // Mark current best as last gen's best for next generation
        this.dots[this.bestDot].isLastGenBest = true;
        
        // Add best dot to next generation
        newDots[0] = new Dot(startPos.x, startPos.y, newBrainSize);
        newDots[0].brain = [...this.dots[this.bestDot].brain];
        if (newBrainSize > this.dots[this.bestDot].brain.length) {
            // Add new random moves for the increased brain size
            for (let j = this.dots[this.bestDot].brain.length; j < newBrainSize; j++) {
                newDots[0].brain[j] = p5.Vector.random2D();
                newDots[0].brain[j].setMag(0.5);
            }
        }
        newDots[0].isBest = true;
        
        // Create new generation
        for (let i = 1; i < newDots.length; i++) {
            let parent = this.selectParent();
            newDots[i] = new Dot(startPos.x, startPos.y, newBrainSize);
            newDots[i].brain = [...parent.brain];
            if (newBrainSize > parent.brain.length) {
                // Add new random moves for the increased brain size
                for (let j = parent.brain.length; j < newBrainSize; j++) {
                    newDots[i].brain[j] = p5.Vector.random2D();
                    newDots[i].brain[j].setMag(0.5);
                }
            }
        }
        
        this.dots = newDots;
        this.gen++;
    }
    
    calculateFitnessSum() {
        this.fitnessSum = 0;
        for (let dot of this.dots) {
            this.fitnessSum += dot.fitness;
        }
    }
    
    selectParent() {
        let rand = random(this.fitnessSum);
        let runningSum = 0;
        
        for (let dot of this.dots) {
            runningSum += dot.fitness;
            if (runningSum > rand) {
                return dot;
            }
        }
        
        return this.dots[0];
    }
    
    mutateBabies() {
        for (let i = 1; i < this.dots.length; i++) {
            this.dots[i].brain = this.dots[i].brain.map(dir => {
                if (random(1) < 0.01) {
                    return p5.Vector.random2D().setMag(0.5);
                }
                return dir;
            });
        }
    }
    
    setBestDot() {
        let max = 0;
        let maxIndex = 0;
        for (let i = 0; i < this.dots.length; i++) {
            if (this.dots[i].fitness > max) {
                max = this.dots[i].fitness;
                maxIndex = i;
            }
        }
        this.bestDot = maxIndex;
        this.bestFitness = max;  // Update best fitness
    }
}
