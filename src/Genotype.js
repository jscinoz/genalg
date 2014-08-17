"use strict";

var Circle = require("./Circle");

function Genotype(world, gene) {
    this.world = world;

    if (gene) {
        this.gene = gene;
    } else {
        Circle.call(this);
    }
}

Genotype.prototype = Object.create(Circle.prototype, {
    gene: {
        get: function() {
            var gene = 0;

            gene = this.x;
            gene = gene << 8;
            gene += this.y 
            gene = gene << 8;
            gene += this.r; 

            return gene;
        },
        set: function(gene) {
            var x = gene >> 16,
                y = (gene - (x << 16)) >> 8,
                r = gene - (x << 16) - (y << 8);

            this.x = x;
            this.y = y;
            this.r = r;
        }
    },
    crossover: {
        value: function(other) {
            var a = this.gene,
                b = other.gene,
                swapAt = Math.round(Math.random() * 24),
                a1 = (a >> swapAt) << swapAt,
                a2 = a - ((a >> (24 - swapAt)) << (24 - swapAt)),
                b1 = (b >> swapAt) << swapAt,
                b2 = b - ((b >> (24 - swapAt)) << (24 - swapAt));

            this.gene = a1 + b2;
            other.gene = b1 + a2;
        }

    },
    fitness: {
        get: function(){
            return this.world.fitness(this);
        },
        enumerable: true
    },
    world: {
        writable: true
    }
});

module.exports = Genotype;
