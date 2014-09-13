"use strict";

var World = require("./World"),
    Circle = require("./Circle"),
    Genotype = require("./Genotype");

function init() {
    var canvas = document.querySelector("canvas"),
        ctx = canvas.getContext("2d"),
        world = new World(0xdeadbeefcafe);

    canvas.width = world.width;
    canvas.height = world.height;

    world.start(ctx);
};

if (typeof window !== "undefined") {
    // We're in a browser!
    window.addEventListener("DOMContentLoaded", init);
}
