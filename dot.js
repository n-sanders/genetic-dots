class Dot {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.brain = new Array(400); // Genetic instructions
        this.dead = false;
        this.reachedGoal = false;
        this.isBest = false;
        this.fitness = 0;
        
        // Initialize random directions
        for (let i = 0; i < this.brain.length; i++) {
            this.brain[i] = p5.Vector.random2D();
            this.brain[i].setMag(0.5);
        }
    }
    
    show() {
        fill(this.isBest ? 0 : 255);
        ellipse(this.pos.x, this.pos.y, 8, 8);
    }
    
    move() {
        if (!this.dead && !this.reachedGoal) {
            if (this.brain.length > 0) {
                this.acc = this.brain[frameCount % this.brain.length];
                this.vel.add(this.acc);
                this.vel.limit(5);
                this.pos.add(this.vel);
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
        let baby = new Dot(startPos.x, startPos.y);
        baby.brain = [...this.brain];
        return baby;
    }
}
