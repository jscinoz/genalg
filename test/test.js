describe("Circle", function() {
    var Circle = require("../src/Circle");

    describe("constructor", function() {
        describe("one argument", function() {
            it("should create a random circle within constraints", function() {
                var circle = new Circle();

                circle.x.should.be.within(0, 255);
                circle.y.should.be.within(0, 255);
                circle.r.should.be.within(0, 255);
            });
        });

        describe("two arguments", function() {
            it("should create a random circle of given radius", function() {
                var radius = 35,
                    circle = new Circle(radius);

                circle.r.should.equal(radius);
            });
        });

        describe("all arguments", function() {
            var radius = 35,
                x = 40,
                y = 100,
                circle = new Circle(radius, x, y);

            it("should create a circle at the given position", function() {
                circle.x.should.equal(x);
                circle.y.should.equal(y);
            });

            it("should create a circle with the given radius", function() {
                circle.r.should.equal(radius);
            });
        });
    });

    describe(".overlapArea", function() {
        var c1 = new Circle(10, 20, 20),
            c2 = new Circle(10, 40, 40)
            c3 = new Circle(5, 20, 20);

        it("should return zero for non-overlapping circles", function() {
            c1.overlapArea(c2).should.equal(0);
        });

        it("should return the area of the smaller circle when contained within the larger", function() {
            c3.overlapArea(c1).should.equal(Math.PI * Math.pow(c3.r, 2));
            c1.overlapArea(c3).should.equal(Math.PI * Math.pow(c3.r, 2));
        });

        // TODO Manually work out some overlapping areas, make test cases
    });
});

describe("Genotype", function() {
    var Genotype = require("../src/Genotype");

    describe("constructor", function() {
        describe("no arguments", function() {
            it("should create a random genotype within world constraints", function() {
                var genotype = new Genotype();

                genotype.x.should.be.within(0, 255);
                genotype.y.should.be.within(0, 255);
                genotype.r.should.be.within(0, 255);
            });
        });

        describe("one argument", function() {
            it("should create with genotype from given gene", function() {
                var genotype = new Genotype(null, 0x42891e);

                genotype.x.should.equal(66);
                genotype.y.should.equal(137);
                genotype.r.should.equal(30);
            });
        });

    });
    describe(".gene", function() {
        it("should equal serialise genotype correctly", function() {
            //    66       137      30
            // 10000101 00010010 0011110
            var genotype = new Genotype(null, 0x42891e);

            genotype.gene.should.equal(0x42891e);
        });
    });
});
