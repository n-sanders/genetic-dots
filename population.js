class Population {
    constructor(size, x, y) {
        this.dots = new Array(size);
        for (let i = 0; i < size; i++) {
            this.dots[i] = new Dot(x, y);
        }
        this.fitnessSum = 0;
        this.gen = 1;
        this.bestDot = 0;
        this.minStep = 400;
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
        
        this.setBestDot();
        this.calculateFitnessSum();
        
        // Add best dot to next generation
        newDots[0] = this.dots[this.bestDot].createBaby();
        newDots[0].isBest = true;
        
        // Create new generation
        for (let i = 1; i < newDots.length; i++) {
            let parent = this.selectParent();
            newDots[i] = parent.createBaby();
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
    }
}
