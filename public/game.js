"use strict";
const squbeDarkness = {
    authors: 'Guillermo Ávila & Inés García',
    canvas: document.querySelector('#myCanvas'),
    ctx: null,
    frameIndex: undefined,
    cube: undefined,
    init() {
        this.setContext();
        this.createCube();
    },
    setContext() {
        this.ctx = this.canvas.getContext('2d');
        console.log(this.ctx);
    },
    createCube() {
        this.cube = new Cube(this.ctx, 40, 60);
    },
};
