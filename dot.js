class Dot {
    constructor(x, y, brainSize) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.brain = new Array(brainSize); // Dynamic brain size
        this.dead = false;
        this.reachedGoal = false;
        this.isBest = false;
        this.isLastGenBest = false;  // New property for last generation's best
        this.fitness = 0;
        this.step = 0;  // Track current step
        
        // Initialize random directions
        for (let i = 0; i < this.brain.length; i++) {
            this.brain[i] = p5.Vector.random2D();
            this.brain[i].setMag(0.5);
        }
    }
    
    show() {
        if (this.isLastGenBest) {
            fill(255, 255, 0);  // Yellow for last generation's best
        } else if (this.isBest) {
            fill(0);  // Black for current best
        } else {
            fill(255);  // White for regular dots
        }
        ellipse(this.pos.x, this.pos.y, 8, 8);
    }
    
    move() {
        if (!this.dead && !this.reachedGoal) {
            if (this.step < this.brain.length) {
                this.acc = this.brain[this.step];
                this.vel.add(this.acc);
                this.vel.limit(5);
                this.pos.add(this.vel);
                this.step++;
            } else {
                this.dead = true;  // Die if we've used all steps
            }
            
            // Check if hit walls
            if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
                this.dead = true;
            }
            
            // Check if reached goal
            let d = dist(this.pos.x, this.pos.y, target.x, target.y);
            if (d < 10) {
                this.reachedGoal = true;
            }
        }
    }
    
    calculateFitness() {
        let d = dist(this.pos.x, this.pos.y, target.x, target.y);
        this.fitness = 1.0 / (d * d);
        
        if (this.reachedGoal) {
            this.fitness *= 10;
        }
        if (this.dead) {
            this.fitness /= 10;
        }
    }
    
    createBaby() {
        let baby = new Dot(startPos.x, startPos.y, this.brain.length);
        baby.brain = [...this.brain];
        return baby;
    }
}
