"use strict";
const squbeDarkness = {
    authors: 'Guillermo Ávila & Inés García',
    canvas: document.querySelector('#myCanvas'),
    ctx: null,
    framesCounter: 0,
    cube: undefined,
    // map: [],
    // enemies: [],
    floorBlocks: [],
    obstacles: [],
    doggies: [],
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
    imageInstanceGameOver: new Image(),
    imageInstanceWinner: new Image(),
    intervalId: undefined,
    startButton: document.querySelector('button'),
    init() {
        this.setContext();
        this.gameLoop();
        this.createMap();
        this.createCube();
        this.createSpotlights();
        this.createPowerUps();
        this.setEventHandlers();
        this.getImageInstance();
        this.setSounds();
    },
    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d');
    },
    createCube() {
        this.cube = new Cube(this.ctx, 400, 450, this.floorBlocks, this.obstacles, this.spotlights, this.doggies);
    },
    createMap() {
        this.level.forEach((row, i) => {
            let counter = 0;
            row.forEach((cell, j) => {
                if (cell === 1) {
                    this.floorBlocks.push(new MapBlock(this.ctx, (j + counter) * 50, i * 50));
                }
                else if (cell === 2) {
                    this.obstacles.push(new BubbleHole(this.ctx, (j + counter) * 50, i * 50));
                }
                else if (cell === 3) {
                    this.doggies.push(new Doggy(this.ctx, (j + counter) * 50, i * 50));
                }
                else if (cell === 4) {
                    this.obstacles.push(new TempSpike(this.ctx, (j + counter) * 50, i * 50));
                }
                else if (cell === 5) {
                    this.obstacles.push(new Spike(this.ctx, (j + counter) * 50, i * 50));
                }
                else if (cell === 6) {
                    this.floorBlocks.push(new BrokenPlatform(this.ctx, (j + counter) * 50, i * 50));
                    counter++;
                }
            });
        });
    },
    createSpotlights() {
        this.spotlights.push(new Spotlight(this.ctx, 1300, 150, 900, 2100, 'left', this.cube, this.floorBlocks), new Spotlight(this.ctx, 3250, 100, 2500, 3900, 'right', this.cube, this.floorBlocks), new Spotlight(this.ctx, 5300, 100, 4900, 5700, 'left', this.cube, this.floorBlocks), new Spotlight(this.ctx, 7350, 70, 6800, 7900, 'right', this.cube, this.floorBlocks), new Spotlight(this.ctx, 9350, 30, 8800, 9900, 'left', this.cube, this.floorBlocks), new Spotlight(this.ctx, 11500, 150, 10700, 12300, 'right', this.cube, this.floorBlocks), new Spotlight(this.ctx, 12300, 100, 11900, 12700, 'left', this.cube, this.floorBlocks));
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
            this.scroll();
            // Cube
            (_a = this.cube) === null || _a === void 0 ? void 0 : _a.draw();
            (_b = this.cube) === null || _b === void 0 ? void 0 : _b.spinRight(this.framesCounter);
            (_c = this.cube) === null || _c === void 0 ? void 0 : _c.spinLeft(this.framesCounter);
            if ((_d = this.cube) === null || _d === void 0 ? void 0 : _d.isDead)
                (_e = this.cube) === null || _e === void 0 ? void 0 : _e.animate(this.framesCounter);
            (_f = this.cube) === null || _f === void 0 ? void 0 : _f.movement();
            // Collisions
            if (!((_g = this.invisibleCubePowerUp) === null || _g === void 0 ? void 0 : _g.isActive)) {
                this.checkLightCollision();
                this.checkBulletCollision();
                if (!this.cube.isDead) {
                    this.checkDoggyCollision();
                    this.checkObstacleCollision;
                }
            }
            // Spotlights
            this.spotlights.forEach(spotlight => {
                var _a, _b, _c;
                if ((_a = spotlight.light) === null || _a === void 0 ? void 0 : _a.isOn) {
                    (_b = spotlight.light) === null || _b === void 0 ? void 0 : _b.draw();
                    spotlight.imageInstance.src = './images/spotlight/spotlight.png';
                }
                else {
                    spotlight.imageInstance.src = './images/spotlight/spotlight-off.png';
                }
                (_c = spotlight.light) === null || _c === void 0 ? void 0 : _c.move();
                spotlight.draw(this.framesCounter);
                spotlight.move();
                spotlight.bullets.forEach(bullet => {
                    bullet.draw();
                    bullet.move();
                });
            });
            // MapBlocks
            this.floorBlocks.forEach(elm => {
                if (elm instanceof BrokenPlatform) {
                    elm.drawPlatform(this.framesCounter);
                    if (elm.isBroken) {
                        elm.break();
                    }
                }
                else {
                    elm.draw();
                }
            });
            // Obstacles
            this.obstacles.forEach(elm => {
                if (elm instanceof TempSpike) {
                    elm.move();
                }
                elm.draw(this.framesCounter);
            });
            // Doggies
            this.doggies.forEach((elm, i) => {
                elm.draw(this.framesCounter);
                if (elm.initialPos.x < this.cube.pos.x + this.pixelDistance ||
                    elm.initialPos.x - 350 > this.cube.pos.x + this.pixelDistance) {
                    elm.isActive = false;
                }
                else {
                    elm.isActive = true;
                }
                if (elm.isActive)
                    elm.canMove = true;
            });
            // PowerUps
            (_h = this.invisibleCubePowerUp) === null || _h === void 0 ? void 0 : _h.draw();
            (_j = this.turnOffLightsPowerUp) === null || _j === void 0 ? void 0 : _j.draw();
            // Distance
            this.updateDistance();
            this.printDistance();
            // Win and Lose Scenario
            if (this.gameOver.status)
                this.printGameOverScreen();
            this.checkWin();
            this.resetGame();
        }, 1000 / 60);
    },
    // --- COLLISIONS
    checkDoggyCollision() {
        this.doggies.forEach(doggy => {
            if (this.checkCollision(this.cube, doggy))
                this.setGameOver();
        });
    },
    checkObstacleCollision() {
        this.obstacles.forEach(obstacle => {
            if (this.checkCollision(this.cube, obstacle))
                this.setGameOver();
        });
    },
    checkLightCollision() {
        this.spotlights.forEach(spotlight => {
            if (spotlight.light.isOn && !this.cube.isHidding) {
                if (this.checkCollision(this.cube, spotlight.light)) {
                    this.cube.isFound = true;
                    spotlight.shoot(this.framesCounter);
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
                if (this.checkCollision(this.cube, bullet)) {
                    this.shootAudio.currentTime = 0;
                    this.shootAudio.play();
                    this.setGameOver();
                }
                this.floorBlocks.forEach(block => {
                    if (this.checkCollision(block, bullet)) {
                        this.shootAudio.currentTime = 0;
                        this.shootAudio.play();
                        const indexOfBulletToRemove = spotlight.bullets.indexOf(bullet);
                        spotlight.deleteCollisionedBullet(indexOfBulletToRemove);
                    }
                });
            });
        });
    },
    checkCollision(r1, r2) {
        if (r2 instanceof (Spike || TempSpike)) {
            if (r1.pos.x < r2.pos.x + r2.size.w &&
                r1.pos.x + r1.size.w - 30 > r2.pos.x &&
                r1.pos.y < r2.pos.y + r2.size.h &&
                r1.size.h + r1.pos.y - 22.5 > r2.pos.y) {
                return true;
            }
        }
        else {
            if (r1.pos.x < r2.pos.x + r2.size.w &&
                r1.pos.x + r1.size.w > r2.pos.x &&
                r1.pos.y < r2.pos.y + r2.size.h &&
                r1.size.h + r1.pos.y > r2.pos.y) {
                return true;
            }
        }
        return false;
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
    // --- SCROLL
    scroll() {
        if (this.cube.pos.x >= 400) {
            this.floorBlocks.forEach(block => {
                if (!this.cube.isDead)
                    block.pos.x += -this.cube.vel.x;
                block.pos.y += -this.cube.vel.y;
            });
            this.obstacles.forEach(obstacle => {
                if (!this.cube.isDead)
                    obstacle.pos.x += -this.cube.vel.x;
                obstacle.pos.y += -this.cube.vel.y;
            });
            this.spotlights.forEach(spotlight => {
                spotlight.pos.x += -this.cube.vel.x;
                spotlight.pos.y += -this.cube.vel.y;
                spotlight.light.pos.x += -this.cube.vel.x;
                spotlight.light.pos.y += -this.cube.vel.y;
                spotlight.bullets.forEach(bullet => {
                    bullet.pos.x += -this.cube.vel.x;
                    bullet.pos.y += -this.cube.vel.y;
                });
                // keep spotlight movement range
                spotlight.maxPosX.l += -this.cube.vel.x;
                spotlight.maxPosX.r += -this.cube.vel.x;
            });
            this.doggies.forEach(doggy => {
                if (!this.cube.isDead)
                    doggy.pos.x += -this.cube.vel.x;
                doggy.pos.y += -this.cube.vel.y;
            });
        }
    },
    // --- DISTANCE
    updateDistance() {
        let platformPosReference = this.floorBlocks[0].pos.x;
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
    getImageInstance() {
        this.imageInstanceGameOver.src = './images/gameover.png';
        this.imageInstanceWinner.src = './images/winner.png';
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
        this.gameOver.opacity += 0.02;
        if (this.gameOver.opacity >= 0.40) {
            this.ctx.drawImage(this.imageInstanceGameOver, 900 - (275 * this.gameOver.opacity / 2), 300, 275 * this.gameOver.opacity, 50 * this.gameOver.opacity);
            this.ctx.fillStyle = '#919191';
            this.ctx.font = '30px sans-serif';
            if (this.gameOver.opacity >= 1) {
                if (this.distance * 0.026458 < 10) {
                    this.ctx.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 856, 400);
                    this.ctx.fillText('m', 926, 400);
                }
                else if ((this.distance * 0.026458 > 10)
                    && (this.distance * 0.026458 < 100)) {
                    this.ctx.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 845, 400);
                    this.ctx.fillText('m', 931, 400);
                }
                else {
                    this.ctx.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 834, 400);
                    this.ctx.fillText('m', 936, 400);
                }
            }
        }
        // linea roja centro del canvas
        this.ctx.beginPath();
        this.ctx.moveTo(900, 0);
        this.ctx.lineTo(900, 800);
        this.ctx.stroke();
        this.ctx.strokeStyle = '#ff0000';
        // borrar intervalo
        if (this.gameOver.opacity >= 1)
            clearInterval(this.intervalId);
    },
    checkWin() {
        if (this.distance * 0.026458 > 103)
            this.printVictoryScreen();
    },
    printVictoryScreen() {
        this.ctx.globalAlpha = this.win.opacity;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, 1800, 800);
        this.ctx.globalAlpha = 1;
        this.win.opacity += 0.01;
        if (this.win.opacity >= 0.40) {
            this.ctx.drawImage(this.imageInstanceWinner, 900 - (200 * this.gameOver.opacity / 2), 300, 275 * this.gameOver.opacity, 50 * this.gameOver.opacity);
        }
        if (this.win.opacity >= 1)
            clearInterval(this.intervalId);
    },
    setSounds() {
        this.backgroundMusicAudio = new Audio('./sounds/background-music.mp3');
        this.backgroundMusicAudio.volume = 0.2;
        this.shootAudio = new Audio('./sounds/shoot.wav');
        this.shootAudio.volume = 0.1;
        this.lightAudio = new Audio('./sounds/light.wav');
        this.lightAudio.volume = 0.1;
        this.invisibilityAudio = new Audio('./sounds/invisibility.wav');
        this.invisibilityAudio.volume = 0.1;
    },
    resetGame() {
        var _a;
        (_a = this.startButton) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            window.location.reload();
        });
    }
};
