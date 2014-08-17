"use strict";

function Circle(r, x, y) {
    if (isNaN(x)) x = Math.round(Math.random() * 255); 
    if (isNaN(y)) y = Math.round(Math.random() * 255); 
    if (isNaN(r)) r = Math.round(Math.random() * 255); 

    this.x = x;
    this.y = y;
    this.r = r;
}

Circle.prototype = Object.create(null, {
    render: {
        value: function(ctx, world, color) {
            ctx.beginPath();
            ctx.arc(
                this.x / 255 * world.width,
                this.y / 255 * world.height,
                (this.r / 255 * world.maxRadius) + world.minRadius,
                2 * Math.PI,
                false
            );
            ctx.closePath();
            
            if (color) {
                ctx.strokeStyle = color;
            }

            ctx.stroke();
        }
    },
    overlapArea: {
        value: function(c2) {
            var c1 = this,
                d = Math.sqrt(
                    Math.pow(c2.x - c1.x, 2) +
                    Math.pow(c2.y - c1.y, 2)
                ),
                r1 = c1.r,
                rr1 = Math.pow(r1, 2),
                r2 = c2.r,
                rr2 = Math.pow(r2, 2),
                ϕ, θ, a1, a2;

            if (d > r2 + r1) {
                // c1 and c2 don't overlap
                return 0;
            } else if (d <= Math.abs(r1 - r2)) {
                // One circle is fully within another

                if (r1 >= r2) {
                    // c2 is fully within c1

                    return Math.PI * Math.pow(r2, 2);
                } else {
                    // c1 is fully within c2;

                    return Math.PI * Math.pow(r1, 2);
                }
            } else {
                // Circles partially overlap
                ϕ = (Math.acos((rr1 + Math.pow(d, 2) - rr2) / (2 * r1 * d))) * 2;
                θ = (Math.acos((rr2 + Math.pow(d, 2) - rr1) / (2 * r2 * d))) * 2;
                a1 = 0.5 * θ * rr2 - 0.5 * rr2 * Math.sin(θ);
                a2 = 0.5 * ϕ * rr1 - 0.5 * rr1 * Math.sin(ϕ);

                return a1 + a2;
            }
        }
    },
    x: {
        enumerable: true,
        writable: true
    },
    y: {
        enumerable: true,
        writable: true
    },
    r: {
        enumerable: true,
        writable: true
    }
});

module.exports = Circle;
