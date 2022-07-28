"use strict";
const squbeDarkness = {
    authors: 'Guillermo Ávila & Inés García',
    canvas: document.querySelector('#myCanvas'),
    ctx: null,
    framesCounter: 0,
    cube: undefined,
    floorBlocks: [],
    doggysArray: [],
    obstaclesArray: [],
    spotlights: [],
    invisibleCubePowerUp: undefined,
    turnOffLightsPowerUp: undefined,
    level: level1,
    distance: 0,
    pixelDistance: 0,
    maxPos: 0,
    gameOver: { status: false, opacity: 0 },
    win: { status: false, opacity: 0 },
    shootAudio: undefined,
    backgroundMusicAudio: undefined,
    lightAudio: undefined,
    invisibilityAudio: undefined,
    intervalId: undefined,
    startButton: document.querySelector('button'),
    init() {
        this.setContext();
        this.gameLoop();
        this.createFloorBlocks();
        this.filterFloorBlocks();
        this.createCube();
        this.createSpotlights();
        this.createPowerUps();
        this.setEventHandlers();
        this.backgroundMusicAudio = new Audio('./sounds/background-music.mp3');
        this.backgroundMusicAudio.volume = 0.2;
        this.shootAudio = new Audio('./sounds/shoot.wav');
        this.shootAudio.volume = 0.1;
        this.lightAudio = new Audio('./sounds/light.wav');
        this.lightAudio.volume = 0.1;
        this.invisibilityAudio = new Audio('./sounds/invisibility.wav');
        this.invisibilityAudio.volume = 0.1;
    },
    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d');
    },
    createCube() {
        this.cube = new Cube(this.ctx, 400, 450, this.floorBlocks, this.spotlights);
    },
    createFloorBlocks() {
        this.level.forEach((row, i) => {
            let contador = 0;
            row.forEach((cell, j) => {
                if (cell === 1) {
                    this.floorBlocks.push(new FloorBlock(this.ctx, (j + contador) * 50, i * 50));
                }
                else if (cell === 2) {
                    this.floorBlocks.push(new BubbleHole(this.ctx, (j + contador) * 50, i * 50));
                }
                else if (cell === 3) {
                    this.floorBlocks.push(new Doggy(this.ctx, (j + contador) * 50, i * 50));
                }
                else if (cell === 4) {
                    this.floorBlocks.push(new TempSpike(this.ctx, (j + contador) * 50, i * 50));
                }
                else if (cell === 5) {
                    this.floorBlocks.push(new Spike(this.ctx, (j + contador) * 50, i * 50));
                }
                else if (cell === 6) {
                    this.floorBlocks.push(new BrokenPlatform(this.ctx, (j + contador) * 50, i * 50));
                    contador += 1;
                }
                else if (cell === 7) {
                    this.floorBlocks.push(new FloorBlock(this.ctx, (j + contador) * 50, i * 50));
                }
            });
        });
    },
    filterFloorBlocks() {
        this.doggysArray = this.floorBlocks.filter(elm => (elm instanceof Doggy));
        this.obstaclesArray = this.floorBlocks.filter(elm => ((elm instanceof BubbleHole) || (elm instanceof Spike) || (elm instanceof TempSpike)));
    },
    createSpotlights() {
        this.spotlights.push(new Spotlight(this.ctx, 1300, 150, 900, 2100, 'left', this.cube, this.floorBlocks), new Spotlight(this.ctx, 3250, 100, 2500, 3900, 'right', this.cube, this.floorBlocks), new Spotlight(this.ctx, 5300, 100, 4900, 5700, 'left', this.cube, this.floorBlocks), new Spotlight(this.ctx, 7350, 100, 6800, 7900, 'right', this.cube, this.floorBlocks), new Spotlight(this.ctx, 9350, 30, 8800, 9900, 'left', this.cube, this.floorBlocks), new Spotlight(this.ctx, 11500, 150, 10700, 12300, 'right', this.cube, this.floorBlocks), new Spotlight(this.ctx, 12300, 100, 11900, 12700, 'left', this.cube, this.floorBlocks));
    },
    createPowerUps() {
        this.invisibleCubePowerUp = new InvisibleCube(this.ctx, 1650, 50);
        this.turnOffLightsPowerUp = new TurnOffLights(this.ctx, 1650, 150);
    },
    // --- INTERVAL
    gameLoop() {
        this.intervalId = setInterval(() => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            this.clearAll();
            this.backgroundMusicAudio.play();
            this.framesCounter >= 600 ? this.framesCounter = 0 : this.framesCounter++;
            this.setEventHandlers();
            (_a = this.cube) === null || _a === void 0 ? void 0 : _a.draw();
            (_b = this.cube) === null || _b === void 0 ? void 0 : _b.spinRight(this.framesCounter);
            (_c = this.cube) === null || _c === void 0 ? void 0 : _c.spinLeft(this.framesCounter);
            if ((_d = this.cube) === null || _d === void 0 ? void 0 : _d.isDead)
                (_e = this.cube) === null || _e === void 0 ? void 0 : _e.animate(this.framesCounter);
            (_f = this.cube) === null || _f === void 0 ? void 0 : _f.movement();
            if (!((_g = this.invisibleCubePowerUp) === null || _g === void 0 ? void 0 : _g.isActive)) {
                this.checkLightCollision();
                if (!this.cube.isDead)
                    this.checkCollision();
                this.checkBulletCollision();
            }
            // SPOTLIGHTS
            this.spotlights.forEach(elm => {
                var _a, _b, _c;
                if ((_a = elm.light) === null || _a === void 0 ? void 0 : _a.isOn) {
                    (_b = elm.light) === null || _b === void 0 ? void 0 : _b.draw();
                    elm.imageInstance.src = './images/spotlight/spotlight.png';
                }
                else {
                    elm.imageInstance.src = './images/spotlight/spotlight-off.png';
                }
                (_c = elm.light) === null || _c === void 0 ? void 0 : _c.move();
                elm.draw(this.framesCounter);
                elm.move();
                elm.bullets.forEach(bullet => {
                    bullet.draw();
                    bullet.move();
                });
            });
            this.floorBlocks.forEach((elm, i) => {
                if (elm instanceof TempSpike) {
                    elm.move();
                }
                if (elm instanceof BrokenPlatform) {
                    if (elm.isBroken) {
                        elm.break();
                    }
                }
                elm.drawBlock(this.framesCounter);
            });
            // DOGGIES
            this.doggysArray.forEach((elm, i) => {
                if (elm.initialPos.x < this.cube.cubePos.x + this.pixelDistance ||
                    elm.initialPos.x - 350 > this.cube.cubePos.x + this.pixelDistance) {
                    elm.isActive = false;
                }
                else {
                    elm.isActive = true;
                }
                if (elm.isActive)
                    elm.canMove = true;
            });
            (_h = this.invisibleCubePowerUp) === null || _h === void 0 ? void 0 : _h.draw();
            (_j = this.turnOffLightsPowerUp) === null || _j === void 0 ? void 0 : _j.draw();
            this.updateDistance();
            this.printDistance();
            if (this.gameOver.status)
                this.printGameOverScreen();
            this.checkWin();
            this.resetGame();
        }, 1000 / 60);
    },
    // --- COLLISIONS
    checkCollision() {
        this.doggysArray.forEach(elm => {
            if (this.cube.cubePos.x < elm.floorPos.x + elm.width &&
                this.cube.cubePos.x + this.cube.cubeSize.w - 20 > elm.floorPos.x &&
                this.cube.cubePos.y < elm.floorPos.y + elm.height &&
                this.cube.cubeSize.h + this.cube.cubePos.y > elm.floorPos.y) {
                this.setGameOver();
            }
        });
        this.obstaclesArray.forEach(elm => {
            if (elm instanceof (Spike || TempSpike)) {
                if (this.cube.cubePos.x < elm.floorPos.x + elm.width &&
                    this.cube.cubePos.x + this.cube.cubeSize.w - 30 > elm.floorPos.x &&
                    this.cube.cubePos.y < elm.floorPos.y + elm.height &&
                    this.cube.cubeSize.h + this.cube.cubePos.y - 22.5 > elm.floorPos.y) {
                    this.setGameOver();
                }
            }
            else {
                if (this.cube.cubePos.x < elm.floorPos.x + elm.width &&
                    this.cube.cubePos.x + this.cube.cubeSize.w > elm.floorPos.x &&
                    this.cube.cubePos.y < elm.floorPos.y + elm.height &&
                    this.cube.cubeSize.h + this.cube.cubePos.y > elm.floorPos.y) {
                    this.setGameOver();
                }
            }
        });
    },
    checkLightCollision() {
        this.spotlights.forEach(spotlight => {
            if (spotlight.light.isOn && !this.cube.isHidding) {
                if (this.cube.cubePos.x < spotlight.light.lightPos.x + spotlight.light.lightSize.w &&
                    this.cube.cubePos.x + this.cube.cubeSize.w > spotlight.light.lightPos.x &&
                    this.cube.cubePos.y < spotlight.light.lightPos.y + spotlight.light.lightSize.h &&
                    this.cube.cubeSize.h + this.cube.cubePos.y > spotlight.light.lightPos.y) {
                    this.cube.isFound = true;
                    if (this.cube.isFound) {
                        if (this.framesCounter % 70 === 0)
                            spotlight.shoot();
                    }
                }
                else {
                    this.cube.isFound = false;
                }
            }
        });
    },
    checkBulletCollision() {
        this.spotlights.forEach(spotlight => {
            spotlight.bullets.forEach(bullet => {
                if (this.cube.cubePos.x < bullet.bulletPos.x + bullet.bulletSize.w &&
                    this.cube.cubePos.x + this.cube.cubeSize.w > bullet.bulletPos.x &&
                    this.cube.cubePos.y < bullet.bulletPos.y + bullet.bulletSize.h &&
                    this.cube.cubeSize.h + this.cube.cubePos.y > bullet.bulletPos.y) {
                    this.shootAudio.currentTime = 0;
                    this.shootAudio.play();
                    this.setGameOver();
                }
                this.floorBlocks.forEach(block => {
                    if (block.floorPos.x < bullet.bulletPos.x + bullet.bulletSize.w &&
                        block.floorPos.x + block.width > bullet.bulletPos.x &&
                        block.floorPos.y < bullet.bulletPos.y + bullet.bulletSize.h &&
                        block.height + block.floorPos.y > bullet.bulletPos.y) {
                        this.shootAudio.currentTime = 0;
                        this.shootAudio.play();
                        const indexOfBulletToRemove = spotlight.bullets.indexOf(bullet);
                        spotlight.deleteCollisionedBullet(indexOfBulletToRemove);
                    }
                });
            });
        });
    },
    // --- POWERUPS
    activeInvisibleCube() {
        var _a;
        if ((_a = this.invisibleCubePowerUp) === null || _a === void 0 ? void 0 : _a.isAvailable) {
            this.invisibilityAudio.play();
            this.invisibleCubePowerUp.isActive = true;
            this.cube.isInvisible = true;
            this.cube.isFound = false;
            setTimeout(() => {
                this.invisibleCubePowerUp.isActive = false;
                this.cube.isInvisible = false;
            }, 5000);
        }
    },
    activeTurnLightsOff() {
        var _a;
        if ((_a = this.turnOffLightsPowerUp) === null || _a === void 0 ? void 0 : _a.isAvailable) {
            this.lightAudio.play();
            this.turnOffLightsPowerUp.isActive = true;
            this.spotlights.forEach(spotlight => spotlight.light.isOn = false);
            this.cube.isFound = false;
            setTimeout(() => {
                this.turnOffLightsPowerUp.isActive = false;
                this.spotlights.forEach(spotlight => spotlight.light.isOn = true);
                this.lightAudio.play();
            }, 5000);
        }
    },
    // --- DISTANCE
    updateDistance() {
        let platformPosReference = this.floorBlocks[0].floorPos.x;
        this.pixelDistance = -platformPosReference;
        if (platformPosReference < this.maxPos) {
            this.distance += 1.5;
            this.maxPos = platformPosReference;
        }
    },
    printDistance() {
        this.ctx.font = '30px Sans-serif';
        this.ctx.fillStyle = 'white';
        if (this.distance * 0.026458 < 10) {
            this.ctx.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 1652, 300);
        }
        else if ((this.distance * 0.026458 > 10)
            && (this.distance * 0.026458 < 100)) {
            this.ctx.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 1636, 300);
        }
        else {
            this.ctx.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 1620, 300);
        }
        this.ctx.font = '20px Sans-serif';
        this.ctx.fillText('m', 1715, 300);
    },
    // --- CLEAR SCREEN
    clearAll() {
        var _a;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, 1800, 900);
    },
    // --- CONTROLS
    setEventHandlers() {
        document.addEventListener('keydown', event => {
            const { key } = event;
            if (!this.cube.isDead) {
                if (key === 'ArrowUp')
                    this.cube.jump();
                if (key === 'ArrowLeft') {
                    if (!this.cube.isDead) {
                        this.cube.leftKey = true;
                    }
                }
                if (key === 'ArrowRight') {
                    if (!this.cube.isDead) {
                        this.cube.rightKey = true;
                    }
                }
                if (key === 'z') {
                    this.activeInvisibleCube();
                    this.invisibleCubePowerUp.isAvailable = false;
                }
                if (key === 'x') {
                    this.activeTurnLightsOff();
                    this.turnOffLightsPowerUp.isAvailable = false;
                }
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
    setGameOver() {
        this.cube.canMove = false;
        this.gameOver.status = true;
        this.cube.isDead = true;
    },
    printGameOverScreen() {
        this.ctx.globalAlpha = this.gameOver.opacity;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, 1800, 800);
        this.ctx.globalAlpha = 1;
        this.gameOver.opacity += 0.01;
        if (this.gameOver.opacity >= 0.40) {
            this.ctx.font = '30px sans-serif';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText('GAME OVER', 450, 200);
        }
        if (this.gameOver.opacity >= 1)
            clearInterval(this.intervalId);
    },
    checkWin() {
        if (this.distance * 0.026458 > 107)
            this.printVictoryScreen();
    },
    printVictoryScreen() {
        this.ctx.globalAlpha = this.win.opacity;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, 1800, 800);
        this.ctx.globalAlpha = 1;
        this.win.opacity += 0.01;
        if (this.win.opacity >= 0.40) {
            this.ctx.font = '30px sans-serif';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText('WINNER', 450, 200);
        }
        if (this.win.opacity >= 1)
            clearInterval(this.intervalId);
    },
    resetGame() {
        var _a;
        (_a = this.startButton) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            window.location.reload();
        });
    }
};
