"use strict";
const squbeDarkness = {
    authors: 'Guillermo Ávila & Inés García',
    canvas: document.querySelector('#myCanvas'),
    ctx: null,
    frameIndex: 0,
    cube: undefined,
    floorBlocks: [],
    enemies: [],
    level: level1,
    distance: 0,
    maxPos: 0,
    intervalId: undefined,
    init() {
        this.setContext();
        this.createCube();
        this.setEventHandlers();
        this.createFloorBlocks();
        this.createEnemies();
        this.gameLoop();
    },
    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d');
    },
    createCube() {
        this.cube = new Cube(this.ctx, 70, 60, this.floorBlocks, this.enemies);
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
    createEnemies() {
        this.enemies.push(new Spotlight(this.ctx, 800, 50, 600, 1000, 'right'));
    },
    // --- INTERVAL
    gameLoop() {
        this.intervalId = setInterval(() => {
            var _a, _b;
            this.clearAll();
            this.frameIndex >= 600 ? this.frameIndex = 0 : this.frameIndex++;
            this.setEventHandlers();
            (_a = this.cube) === null || _a === void 0 ? void 0 : _a.draw();
            (_b = this.cube) === null || _b === void 0 ? void 0 : _b.movement();
            this.floorBlocks.forEach(elm => {
                if (elm instanceof TempSpike) {
                    if (this.frameIndex >= 100 && this.frameIndex <= 300) {
                        elm.moveUp();
                    }
                    else if (this.frameIndex >= 400 && this.frameIndex <= 600) {
                        elm.moveDown();
                    }
                }
                elm.drawBlock();
            });
            this.enemies.forEach(enemy => {
                var _a, _b;
                enemy.draw();
                enemy.move();
                (_a = enemy.light) === null || _a === void 0 ? void 0 : _a.draw();
                (_b = enemy.light) === null || _b === void 0 ? void 0 : _b.move();
            });
            this.updateDistance();
            this.printDistance();
            // this.drawTriangle()
            // console.log()
        }, 1000 / 60);
    },
    // --- DISTANCE
    updateDistance() {
        let platformPosReference = this.floorBlocks[0].floorPos.x;
        if (platformPosReference < this.maxPos) {
            this.distance += 1.5;
            this.maxPos = platformPosReference;
        }
    },
    printDistance() {
        this.ctx.font = '20px Sans-serif';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`DISTANCE: ${(this.distance * 0.026458).toFixed(2)} meters`, 450, 100);
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
                console.log(this.cube.cubePos.x);
            }
        });
        document.addEventListener('keyup', event => {
            const { key } = event;
            if (key === 'ArrowLeft')
                this.cube.leftKey = false;
            if (key === 'ArrowRight')
                this.cube.rightKey = false;
        });
    },
    drawTriangle() {
        // Light
        // this.ctx!.beginPath();
        // this.ctx!.moveTo(this.spotlightPos.x + this.spotlightCenter - 200, 350);
        // this.ctx!.lineTo(this.spotlightPos.x + this.spotlightCenter + 200, 350);
        // this.ctx!.lineTo(this.spotlightPos.x + this.spotlightCenter, this.spotlightPos.y + this.spotlightCenter);
        // this.ctx!.closePath();
        // this.ctx!.fillStyle = "#FFCC00";
        // this.ctx!.fill();
    }
};
