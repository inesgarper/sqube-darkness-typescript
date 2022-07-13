"use strict";
const squbeDarkness = {
    authors: 'Guillermo Ávila & Inés García',
    canvas: document.querySelector('#myCanvas'),
    ctx: null,
    frameIndex: 0,
    cube: undefined,
    floorBlocks: [],
    keyPressed: [],
    intervalId: undefined,
    init() {
        this.setContext();
        this.createCube();
        this.setEventHandlers();
        this.movement();
        this.createFloorBlocks();
        this.drawAll();
    },
    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d');
    },
    createCube() {
        this.cube = new Cube(this.ctx, 40, 60);
    },
    createFloorBlocks() {
        this.floorBlocks.push(new Floor(this.ctx, 0, 450, 300, 50), new Floor(this.ctx, 300, 400, 300, 100));
    },
    // --- INTERVAL
    drawAll() {
        this.intervalId = setInterval(() => {
            var _a;
            this.clearAll();
            this.frameIndex++;
            (_a = this.cube) === null || _a === void 0 ? void 0 : _a.drawCube();
            this.movement();
            this.floorBlocks.forEach(elm => elm.drawFloor());
            console.log(this.floorBlocks);
        }, 1000 / 60);
    },
    // --- CLEAR SCREEN
    clearAll() {
        var _a;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, 1200, 500);
    },
    // --- CONTROLS
    movement() {
        this.keyPressed.forEach(elm => {
            var _a, _b;
            if (elm.includes('ArrowRight'))
                (_a = this.cube) === null || _a === void 0 ? void 0 : _a.moveRight();
            if (elm.includes('ArrowLeft'))
                (_b = this.cube) === null || _b === void 0 ? void 0 : _b.moveLeft();
        });
    },
    setEventHandlers() {
        document.addEventListener('keydown', event => {
            var _a;
            const { key } = event;
            if (key === 'ArrowUp')
                (_a = this.cube) === null || _a === void 0 ? void 0 : _a.jump();
            if (key === 'ArrowRight' && !(this.keyPressed.includes('ArrowRight')))
                this.keyPressed.push('ArrowRight');
            else if (key === 'ArrowLeft' && !(this.keyPressed.includes('ArrowLeft')))
                this.keyPressed.push('ArrowLeft');
        });
        document.addEventListener('keyup', event => {
            const { key } = event;
            if (key === 'ArrowRight')
                this.keyPressed = [];
            else if (key === 'ArrowLeft')
                this.keyPressed = [];
            else
                return null;
        });
    },
};
