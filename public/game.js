"use strict";
const squbeDarkness = {
    authors: 'Guillermo Ávila & Inés García',
    canvas: document.querySelector('#myCanvas'),
    ctx: null,
    frameIndex: 0,
    cube: undefined,
    floorBlocks: [],
    level: level1,
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
        this.cube = new Cube(this.ctx, 70, 60, this.floorBlocks);
    },
    createFloorBlocks() {
        this.level.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell === 1) {
                    this.floorBlocks.push(new FloorBlock(this.ctx, j * 50, i * 50));
                }
                else if (cell === 2) {
                    this.floorBlocks.push(new BubbleHole(this.ctx, j * 50, i * 50));
                }
                else if (cell === 3) {
                    this.floorBlocks.push(new Doggy(this.ctx, j * 50, i * 50));
                }
                else if (cell === 4) {
                    this.floorBlocks.push(new TempSpike(this.ctx, j * 50, i * 50));
                }
                else if (cell === 5) {
                    this.floorBlocks.push(new Spike(this.ctx, j * 50, i * 50));
                }
                else if (cell === 6) {
                    this.floorBlocks.push(new BrokenPlatform(this.ctx, j * 50, i * 50));
                }
            });
        });
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
            // console.log('JUGADOR---->', this.cube!.cubePos.x + this.cube!.cubeSize.w)
            // console.log('PLATAFORMA--->', this.floorBlocks[3].floorPos.x)
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
            const { key } = event;
            if (key === 'ArrowUp')
                this.cube.jump();
            if (key === 'ArrowLeft')
                this.cube.leftKey = true;
            if (key === 'ArrowRight')
                this.cube.rightKey = true;
            if (key === 'ArrowDown') {
                console.log(`ESTA COLISIONANDO A LA DERECHA? -- ${this.cube.isHiddingRight}`);
                console.log(`ESTA COLISIONANDO A LA IZQUIERDA? -- ${this.cube.isHiddingLeft}`);
            }
        });
        document.addEventListener('keyup', event => {
            const { key } = event;
            if (key === 'ArrowLeft')
                this.cube.leftKey = false;
            if (key === 'ArrowRight')
                this.cube.rightKey = false;
        });
    }
};
