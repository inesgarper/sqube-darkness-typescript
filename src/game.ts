interface gameTemplate {
    authors: string

    canvas: HTMLCanvasElement
    ctx: null | CanvasRenderingContext2D

    frameIndex: number

    cube: undefined | Cube
    floorBlocks: Array<Cell>
    filteredFloorBlocks: Array<BubbleHole | Spike | TempSpike | BrokenPlatform | Doggy>
    enemies: Array<Spotlight>
    level: Array<Array<number>>
    distance: number
    maxPos: number

    intervalId: number | undefined


    init(): void
    setContext(): void
    createCube(): void
    createFloorBlocks(): void
    filterFloorBlocks(): void
    createEnemies(): void
    setEventHandlers(): void
    gameLoop(): void
    clearAll(): void
    updateDistance(): void
    printDistance(): void
    checkCollision(): void
    checkLightCollision(): void
    checkBulletCollision(): void
    drawTriangle(): void

}

const squbeDarkness: gameTemplate = {
    authors: 'Guillermo Ávila & Inés García',

    canvas: document.querySelector('#myCanvas') as HTMLCanvasElement,
    ctx: null,

    frameIndex: 0,

    cube: undefined,
    floorBlocks: [],
    filteredFloorBlocks: [],
    enemies: [],
    level: level1,
    distance: 0,
    maxPos: 0,

    intervalId: undefined,

    init() {
        this.setContext()
        this.createCube()
        this.setEventHandlers()
        this.createFloorBlocks()
        // optional
        this.filterFloorBlocks()
        this.createEnemies()
        this.gameLoop()
    },

    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d')
    },

    createCube() {
        this.cube = new Cube(this.ctx, 70, 60, this.floorBlocks, this.enemies)
    },

    createFloorBlocks() {

        // ORIGINAL

        // this.level.forEach((row, i) => {
        //     row.forEach((cell, j) => {
        //         if (cell === 1) {
        //             this.floorBlocks.push(new FloorBlock(this.ctx, j * 50, i * 50))
        //         } else if (cell === 2) {
        //             this.floorBlocks.push(new BubbleHole(this.ctx, j * 50, i * 50))
        //         } else if (cell === 3) {
        //             this.floorBlocks.push(new Doggy(this.ctx, j * 50, i * 50))
        //         } else if (cell === 4) {
        //             this.floorBlocks.push(new TempSpike(this.ctx, j * 50, i * 50))
        //         } else if (cell === 5) {
        //             this.floorBlocks.push(new Spike(this.ctx, j * 50, i * 50))
        //         } else if (cell === 6) {
        //             this.floorBlocks.push(new BrokenPlatform(this.ctx, j * 50, i * 50))
        //         }
        //     })
        // })


        // INTENTO CON CONTADOR CUTRE

        this.level.forEach((row, i) => {
            let contador: number = 0
            row.forEach((cell, j) => {
                if (cell === 1) {
                    this.floorBlocks.push(new FloorBlock(this.ctx, (j + contador) * 50, i * 50))
                } else if (cell === 2) {
                    this.floorBlocks.push(new BubbleHole(this.ctx, (j + contador) * 50, i * 50))
                } else if (cell === 3) {
                    this.floorBlocks.push(new Doggy(this.ctx, (j + contador) * 50, i * 50))
                } else if (cell === 4) {
                    this.floorBlocks.push(new TempSpike(this.ctx, (j + contador) * 50, i * 50))
                } else if (cell === 5) {
                    this.floorBlocks.push(new Spike(this.ctx, (j + contador) * 50, i * 50))
                } else if (cell === 6) {
                    this.floorBlocks.push(new BrokenPlatform(this.ctx, (j + contador) * 50, i * 50))
                    contador += 1
                } else if (cell === 7) {
                    this.floorBlocks.push(new DoggyPlatform(this.ctx, (j + contador) * 50, i * 50))
                }
            })
        })


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
        this.filteredFloorBlocks = this.floorBlocks.filter(elm => !(elm instanceof FloorBlock))
    },

    createEnemies() {
        this.enemies.push(new Spotlight(this.ctx, 800, 50, 600, 1000, 'right', this.cube!, this.floorBlocks))
    },

    // --- INTERVAL
    gameLoop() {
        this.intervalId = setInterval(() => {
            this.clearAll()
            this.frameIndex >= 600 ? this.frameIndex = 0 : this.frameIndex++
            this.setEventHandlers()
            this.cube?.draw()
            this.cube?.movement()
            this.checkLightCollision()
            this.checkBulletCollision()
            this.checkCollision()
            this.floorBlocks.forEach(elm => {
                if (elm instanceof TempSpike) {
                    if (this.frameIndex >= 100 && this.frameIndex <= 300) {
                        elm.moveUp()
                    } else if (this.frameIndex >= 400 && this.frameIndex <= 600) {
                        elm.moveDown()
                    }
                }
                if (elm instanceof BrokenPlatform) {
                    if (elm.isBroken) {
                        elm.break()
                    }
                }
                elm.drawBlock()
            })
            this.enemies.forEach(enemy => {
                enemy.draw()
                enemy.move()
                enemy.light?.draw()
                enemy.light?.move()
                enemy.bullets.forEach(bullet => {
                    bullet.draw()
                    bullet.move()
                });
            })
            this.updateDistance()
            this.printDistance()
            // this.drawTriangle()
            // console.log()
        }, 1000 / 60)
    },

    // --- COLLISIONS
    checkCollision() {
        this.filteredFloorBlocks.forEach(elm => {

            if (this.cube!.cubePos.x < elm.floorPos.x + elm.width &&
                this.cube!.cubePos.x + this.cube!.cubeSize.w > elm.floorPos.x &&
                this.cube!.cubePos.y < elm.floorPos.y + elm.height &&
                this.cube!.cubeSize.h + this.cube!.cubePos.y > elm.floorPos.y) {

                if (elm instanceof BrokenPlatform) {
                    console.log('hola')
                } else {
                    console.log('DEBERÍA MORIR')
                }

            }

        })

    },

    checkLightCollision(): void {

        this.enemies.forEach(enemy => {
            if (enemy instanceof Spotlight && !this.cube!.isHidding) {

                if (this.cube!.cubePos.x < enemy.light!.lightPos.x + enemy.light!.lightSize.w &&
                    this.cube!.cubePos.x + this.cube!.cubeSize.w > enemy.light!.lightPos.x &&
                    this.cube!.cubePos.y < enemy.light!.lightPos.y + enemy.light!.lightSize.h &&
                    this.cube!.cubeSize.h + this.cube!.cubePos.y > enemy.light!.lightPos.y) {

                    this.cube!.isFound = true

                    if (this.cube!.isFound) {

                        if (this.frameIndex % 20 === 0) enemy.shoot()

                    }

                } else {
                    this.cube!.isFound = false
                }
            }
        })
    },

    checkBulletCollision(): void {

        this.enemies.forEach(enemy => {
            if (enemy instanceof Spotlight) {

                enemy.bullets.forEach(bullet => {
                    if (this.cube!.cubePos.x < bullet.bulletPos.x + bullet.bulletSize.w &&
                        this.cube!.cubePos.x + this.cube!.cubeSize.w > bullet.bulletPos.x &&
                        this.cube!.cubePos.y < bullet.bulletPos.y + bullet.bulletSize.h &&
                        this.cube!.cubeSize.h + this.cube!.cubePos.y > bullet.bulletPos.y) {

                        // GAME OVER

                    }

                    this.floorBlocks.forEach(block => {
                        if (block.floorPos.x < bullet.bulletPos.x + bullet.bulletSize.w &&
                            block.floorPos.x + block.width > bullet.bulletPos.x &&
                            block.floorPos.y < bullet.bulletPos.y + bullet.bulletSize.h &&
                            block.height + block.floorPos.y > bullet.bulletPos.y) {

                            const indexOfBulletToRemove: number = enemy.bullets.indexOf(bullet)
                            enemy.deleteCollisionedBullet(indexOfBulletToRemove)

                        }
                    })
                })
            }
        })

    },

    // --- DISTANCE
    updateDistance() {

        let platformPosReference: number = this.floorBlocks[0].floorPos.x

        if (platformPosReference < this.maxPos) {
            this.distance += 1.5
            this.maxPos = platformPosReference
        }
    },

    printDistance() {
        this.ctx!.font = '20px Sans-serif'
        this.ctx!.fillStyle = 'white'
        this.ctx!.fillText(`DISTANCE: ${(this.distance * 0.026458).toFixed(2)} meters`, 450, 100)
    },

    // --- CLEAR SCREEN
    clearAll() {
        this.ctx?.clearRect(0, 0, 1200, 500)
    },


    // --- CONTROLS
    setEventHandlers() {
        document.addEventListener('keydown', event => {
            const { key } = event

            if (key === 'ArrowUp') this.cube!.jump()
            if (key === 'ArrowLeft') this.cube!.leftKey = true
            if (key === 'ArrowRight') this.cube!.rightKey = true
            if (key === 'ArrowDown') {
                console.log()
            }
        })

        document.addEventListener('keyup', event => {
            const { key } = event

            if (key === 'ArrowLeft') this.cube!.leftKey = false
            if (key === 'ArrowRight') this.cube!.rightKey = false
        })
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

}



