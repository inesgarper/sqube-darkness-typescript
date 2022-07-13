"use strict";
const squbeDarkness = {
    authors: 'Guillermo Ávila & Inés García',
    canvas: document.querySelector('#myCanvas'),
    ctx: null,
    frameIndex: 0,
    cube: undefined,
    keyPressed: [],
    intervalId: undefined,
    init() {
        this.setContext();
        this.createCube();
        this.setEventHandlers();
        this.drawAll();
    },
    setContext() {
        this.ctx = this.canvas.getContext('2d');
        console.log(this.ctx);
    },
    createCube() {
        this.cube = new Cube(this.ctx, 40, 60);
    },
    drawAll() {
        this.intervalId = setInterval(() => {
            var _a;
            this.clearAll();
            this.frameIndex++;
            (_a = this.cube) === null || _a === void 0 ? void 0 : _a.drawCube();
        }, 1000 / 60);
    },
    setEventHandlers() {
        document.addEventListener('keydown', event => {
            var _a;
            const { key } = event;
            if (key === 'ArrowRight')
                (_a = this.cube) === null || _a === void 0 ? void 0 : _a.moveRight();
        });
    },
    clearAll() {
        var _a;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, 1200, 500);
    }
};
