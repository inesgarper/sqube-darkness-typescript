"use strict";
const squbeDarkness = {
    authors: 'Guillermo Ávila & Inés García',
    canvas: document.querySelector('#myCanvas'),
    ctx: null,
    frameIndex: 0,
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
    intervalId: undefined,
    init() {
        this.setContext();
        this.gameLoop();
        this.createFloorBlocks();
        this.filterFloorBlocks();
        this.createCube();
        this.createSpotlights();
        this.createPowerUps();
        this.setEventHandlers();
    },
    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d');
    },
    createCube() {
        this.cube = new Cube(this.ctx, 70, 60, this.floorBlocks, this.spotlights);
    },
    createFloorBlocks() {
        // INTENTO CON CONTADOR CUTRE
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
        // SE DESCUAJARINGA EL MAPA
        // this.level.forEach((row, i) => {
        //     let point: number = -50
        //     let variable: number = 50
        //     row.forEach((cell, j) => {
        //         if (cell === 1) {
        //             this.floorBlocks.push(new FloorBlock(this.ctx, point + variable, i * 50))
        //             variable = 50
        //         } else if (cell === 2) {
        //             this.floorBlocks.push(new BubbleHole(this.ctx, point + variable, i * 50))
        //             variable = 50
        //         } else if (cell === 3) {
        //             this.floorBlocks.push(new Doggy(this.ctx, point + variable, i * 50))
        //             variable = 50
        //         } else if (cell === 4) {
        //             this.floorBlocks.push(new TempSpike(this.ctx, point + variable, i * 50))
        //             variable = 50
        //         } else if (cell === 5) {
        //             this.floorBlocks.push(new Spike(this.ctx, point + variable, i * 50))
        //             variable = 50
        //         } else if (cell === 6) {
        //             this.floorBlocks.push(new BrokenPlatform(this.ctx, point + variable, i * 50))
        //             variable = 100
        //         }
        //         point += variable
        //     })
        // })
    },
    filterFloorBlocks() {
        this.doggysArray = this.floorBlocks.filter(elm => (elm instanceof Doggy));
        this.obstaclesArray = this.floorBlocks.filter(elm => ((elm instanceof BubbleHole) || (elm instanceof Spike) || (elm instanceof TempSpike)));
    },
    createSpotlights() {
        this.spotlights.push(new Spotlight(this.ctx, 800, 50, 600, 1000, 'right', this.cube, this.floorBlocks));
    },
    createPowerUps() {
        this.invisibleCubePowerUp = new InvisibleCube(this.ctx, 1400, 100);
        this.turnOffLightsPowerUp = new TurnOffLights(this.ctx, 1600, 100);
    },
    // --- INTERVAL
    gameLoop() {
        this.intervalId = setInterval(() => {
            var _a, _b, _c, _d, _e;
            this.clearAll();
            this.frameIndex >= 600 ? this.frameIndex = 0 : this.frameIndex++;
            this.setEventHandlers();
            (_a = this.cube) === null || _a === void 0 ? void 0 : _a.draw();
            (_b = this.cube) === null || _b === void 0 ? void 0 : _b.movement();
            if (!((_c = this.invisibleCubePowerUp) === null || _c === void 0 ? void 0 : _c.isActive)) {
                this.checkLightCollision();
                this.checkCollision();
                this.checkBulletCollision();
            }
            // SPOTLIGHTS
            this.spotlights.forEach(elm => {
                var _a, _b, _c;
                elm.draw();
                elm.move();
                if ((_a = elm.light) === null || _a === void 0 ? void 0 : _a.isOn) {
                    (_b = elm.light) === null || _b === void 0 ? void 0 : _b.draw();
                }
                (_c = elm.light) === null || _c === void 0 ? void 0 : _c.move();
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
                elm.drawBlock();
            });
            // DOGGYS
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
            (_d = this.invisibleCubePowerUp) === null || _d === void 0 ? void 0 : _d.draw();
            (_e = this.turnOffLightsPowerUp) === null || _e === void 0 ? void 0 : _e.draw();
            this.updateDistance();
            this.printDistance();
            if (this.gameOver.status)
                this.printGameOverScreen();
            this.checkWin();
        }, 1000 / 60);
    },
    // --- COLLISIONS
    checkCollision() {
        this.doggysArray.forEach(elm => {
            if (this.cube.cubePos.x < elm.floorPos.x + elm.width &&
                this.cube.cubePos.x + this.cube.cubeSize.w > elm.floorPos.x &&
                this.cube.cubePos.y < elm.floorPos.y + elm.height &&
                this.cube.cubeSize.h + this.cube.cubePos.y > elm.floorPos.y) {
                // this.setGameOver()
            }
        });
        this.obstaclesArray.forEach(elm => {
            if (elm instanceof (Spike || TempSpike)) {
                if (this.cube.cubePos.x + 10 < elm.floorPos.x + elm.width &&
                    this.cube.cubePos.x + this.cube.cubeSize.w - 10 > elm.floorPos.x &&
                    this.cube.cubePos.y + 12.5 < elm.floorPos.y + elm.height &&
                    this.cube.cubeSize.h + this.cube.cubePos.y > elm.floorPos.y) {
                    // this.setGameOver()
                }
            }
            else {
                if (this.cube.cubePos.x < elm.floorPos.x + elm.width &&
                    this.cube.cubePos.x + this.cube.cubeSize.w > elm.floorPos.x &&
                    this.cube.cubePos.y < elm.floorPos.y + elm.height &&
                    this.cube.cubeSize.h + this.cube.cubePos.y > elm.floorPos.y) {
                    // this.setGameOver()
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
                        if (this.frameIndex % 30 === 0)
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
                    // this.setGameOver()
                }
                this.floorBlocks.forEach(block => {
                    if (block.floorPos.x < bullet.bulletPos.x + bullet.bulletSize.w &&
                        block.floorPos.x + block.width > bullet.bulletPos.x &&
                        block.floorPos.y < bullet.bulletPos.y + bullet.bulletSize.h &&
                        block.height + block.floorPos.y > bullet.bulletPos.y) {
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
            this.turnOffLightsPowerUp.isActive = true;
            this.spotlights.forEach(spotlight => spotlight.light.isOn = false);
            this.cube.isFound = false;
            setTimeout(() => {
                this.turnOffLightsPowerUp.isActive = false;
                this.spotlights.forEach(spotlight => spotlight.light.isOn = true);
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
        this.ctx.font = '20px Sans-serif';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`DISTANCE: ${(this.distance * 0.026458).toFixed(2)} meters`, 450, 100);
    },
    // --- CLEAR SCREEN
    clearAll() {
        var _a;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, 1800, 800);
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
            if (key === 'z') {
                this.activeInvisibleCube();
                this.invisibleCubePowerUp.isAvailable = false;
            }
            if (key === 'x') {
                this.activeTurnLightsOff();
                this.turnOffLightsPowerUp.isAvailable = false;
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
        this.gameOver.status = true;
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
        if (this.distance * 0.026458 > 100)
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
    }
};
