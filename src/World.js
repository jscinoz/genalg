"use strict"

var Circle = require("./Circle"),
    Genotype = require("./Genotype");

function World(seed, width, height, maxRadius, numCircles, population) {
    Math.seedrandom(seed);
    
    if (width) this.width = width;
    if (height) this.height = height;
    if (maxRadius) this.width = width;

    this.addCircles(numCircles || 50);
    this.populate(population || 10);
}

World.prototype = Object.create(null, {
    contains: {
        value: function(circle) {
            return (
                circle.x - circle.r >= 0 &&
                circle.y - circle.r >= 0 && 
                circle.x + circle.r < this.width &&
                circle.y + circle.r < this.height
            );
        }
    },
    wouldOverlap: {
        value: function(circle) {
            var circles = this.circles,
                circleIdx = circles.indexOf(circle);

            // FIXME: Don't check against self
            for (var i = 0, ii = circles.length; i < ii; ++i) { 

                if (i !== circleIdx && circle.overlapArea(circles[i]) !== 0) {
                    return true;
                }
            }

            return false;
        }
    },
    addCircles: {
        value: function(numCircles) {
            var circles = this.circles,
                circle;

            while (circles.length < numCircles) {
                circle = new Circle();
                
                if (this.contains(circle) && !this.wouldOverlap(circle)) {
                    circles.push(circle);
                }
            }

            this.circles = circles;
        }
    },
    populate: {
        value: function(population) {
            var genotypes = this.genotypes;

            for (var i = 0, ii = population; i < ii; ++i) {
                genotypes.push(new Genotype(this));
            }

            this.genotypes = genotypes;
        }
    },
    getTotalOverlapArea: {
        value: function(circle) {
            var circles = this.circles,
                totalArea = 0;

            // FIXME: Don't check against self
            for (var i = 0, ii = circles.length; i < ii; ++i) {
                totalArea += circle.overlapArea(circles[i]);
            }

            return totalArea;
        }
    },
    fitness: {
        value: function(circle) {
            var intersectArea = this.getTotalOverlapArea(circle),
                isInBounds = this.contains(circle);

            return Math.round(circle.r * (
                (
                    intersectArea === 0 ? 1 : (
                        isInBounds ? -intersectArea : intersectArea
                    )
                ) *
                (isInBounds ? 1 : -2)
            )) + this.worstFitness;
        }
    },
    updateFitness: {
        value: function() {
            var genotypes = this.genotypes;

            genotypes.sort(function(a, b) {
                return a.fitness - b.fitness;
            });

            this.worstFitness = Math.abs(genotypes[0].fitness);

            this.genotypes = genotypes;
        }
    },
    weightedRandomGenome: {
        value: function () {
            var genotypes = this.genotypes,
                totalFitness = genotypes.reduce(function(a, b) {
                    return (typeof a === "number" ? a : a.fitness) + b.fitness;
                }),
                weights = genotypes.map(function(x) {
                    return x.fitness / totalFitness;
                }).sort(),
                total = 0,
                totals = weights.map(function(x) {
                    total += x;
                    
                    return total;
                }),
                target = Math.random() * total;

            var low = 0, high = totals.length, idx, curr, prev;
            
            while (low <= high) {
                idx = Math.round((low + high) / 2);
                curr = totals[idx];
                prev = totals[idx - 1] || 0;

                if (target > prev) {
                    if (target <= curr) {
                        return genotypes.splice(idx, 1)[0];
                    } else {
                        low = idx;
                    }
                } else if (idx != high) {
                    high = idx;
                } else {
                    high = 0;
                }
            }
        }
    },
    evolve: {
        value: function() {
            var selected = [];

            while (selected.length < 2) {
                selected.push(this.weightedRandomGenome());
            }

            selected[0].crossover(selected[1]);

            this.genotypes.push(selected[0], selected[1]);
        }
    },
    worldTick: {
        value: function() {
            this.updateFitness();
            this.evolve();
        }
    },
    start: {
        value: function(ctx, lastFrame) {
            var circles = this.circles,
                time = Date.now(),
                RENDER_FPS = 30,
                EVOLVE_FPS = Infinity,
                genotypes = this.genotypes;
    
            if (isNaN(lastFrame) || time - lastFrame >= 1000 / EVOLVE_FPS) {
                this.worldTick();        
            }

            // Only redraw canvas at limited framerate
            if (isNaN(lastFrame) || time - lastFrame >= 1000 / RENDER_FPS) {
                ctx.clearRect(0, 0, this.width, this.height);
            
                for (var i = 0, ii = circles.length; i < ii; ++i) {
                    circles[i].render(ctx, this, "black");
                }

                for (var i = 0, ii = genotypes.length; i < ii; ++i) {
                    genotypes[i].render(ctx, this, "red");
                }

                lastFrame = time;
            }

            requestAnimationFrame(this.start.bind(this, ctx, lastFrame));
        }
    },
    circles: {
        value: [],
        writable: true
    },
    genotypes: {
        value: [],
        writable: true
    },
    width: {
        value: 500,
        writable: true
    },
    height: {
        value: 500,
        writable: true
    },
    minRadius: {
        value: 10,
        writable: true
    },
    maxRadius: {
        value: 100,
        writable: true
    },
    worstFitness: {
        value: 0,
        writable: true
    }
});

module.exports = World;
