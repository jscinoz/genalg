require("chai").should();

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
            it("should create with genotype from given gene correctly", function() {
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
