"use strict";
const squbeDarkness = {
    authors: 'Guillermo Ávila & Inés García',
    canvas: document.querySelector('#myCanvas'),
    ctx: null,
    frameIndex: 0,
    cube: undefined,
    floorBlocks: [],
    intervalId: undefined,
    init() {
        this.setContext();
        this.createCube();
        this.setEventHandlers();
        this.createFloorBlocks();
        this.gameLoop();
    },
    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d');
    },
    createCube() {
        this.cube = new Cube(this.ctx, 40, 60, this.floorBlocks);
    },
    createFloorBlocks() {
        this.floorBlocks.push(new FloorBlock(this.ctx, 0, 450, 300, 50), new FloorBlock(this.ctx, 300, 400, 300, 100), new FloorBlock(this.ctx, 600, 450, 200, 50), new FloorBlock(this.ctx, 800, 250, 100, 300), new FloorBlock(this.ctx, 900, 400, 250, 100));
    },
    // --- INTERVAL
    gameLoop() {
        this.intervalId = setInterval(() => {
            var _a, _b;
            this.clearAll();
            this.frameIndex++;
            this.setEventHandlers();
            (_a = this.cube) === null || _a === void 0 ? void 0 : _a.draw();
            (_b = this.cube) === null || _b === void 0 ? void 0 : _b.movement();
            this.floorBlocks.forEach(elm => elm.drawBlock());
        }, 1000 / 60);
    },
    // --- CLEAR SCREEN
    clearAll() {
        var _a;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, 1200, 500);
    },
    // --- CONTROLS
    setEventHandlers() {
        document.addEventListener('keydown', event => {
            var _a;
            const { key } = event;
            if (key === 'ArrowUp')
                this.cube.upKey = true;
            if (key === 'ArrowLeft')
                this.cube.leftKey = true;
            if (key === 'ArrowRight')
                this.cube.rightKey = true;
            if (key === 'ArrowDown')
                console.log((_a = this.cube) === null || _a === void 0 ? void 0 : _a.cubePos);
        });
        document.addEventListener('keyup', event => {
            const { key } = event;
            if (key === 'ArrowUp')
                this.cube.upKey = false;
            if (key === 'ArrowLeft')
                this.cube.leftKey = false;
            if (key === 'ArrowRight')
                this.cube.rightKey = false;
        });
    }
};
