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
        this.movement();
        this.drawAll();
    },
    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d');
    },
    createCube() {
        this.cube = new Cube(this.ctx, 40, 60);
    },
    // --- INTERVAL
    drawAll() {
        this.intervalId = setInterval(() => {
            var _a;
            this.clearAll();
            this.frameIndex++;
            (_a = this.cube) === null || _a === void 0 ? void 0 : _a.drawCube();
            this.movement();
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
<<<<<<< HEAD
            var _a, _b;
            const { key } = event;
            if (key === 'ArrowRight')
                (_a = this.cube) === null || _a === void 0 ? void 0 : _a.moveRight();
            if (key === 'ArrowUp')
                (_b = this.cube) === null || _b === void 0 ? void 0 : _b.jump();
=======
            const { key } = event;
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
>>>>>>> ad636d7f51739f592a843c498ddf132422251edf
        });
    },
};
