interface gameTemplate {
    authors: string

    canvas: HTMLCanvasElement
    ctx: null | CanvasRenderingContext2D

    frameIndex: number

    cube: undefined | Cube
    floorBlocks: Array<Cell | Doggy>
    doggysArray: Array<Doggy>
    // enemiessArray: Array<Cell>
    obstaclesArray: Array<Cell>
    enemies: Array<Spotlight>
    level: Array<Array<number>>
    distance: number
    maxPos: number
    pixelDistance: number
    gameOver: { status: boolean, opacity: number }

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
    setGameOver(): void
    printGameOverScreen(): void

}

const squbeDarkness: gameTemplate = {
    authors: 'Guillermo Ávila & Inés García',

    canvas: document.querySelector('#myCanvas') as HTMLCanvasElement,
    ctx: null,

    frameIndex: 0,

    cube: undefined,
    floorBlocks: [],
    doggysArray: [],
    obstaclesArray: [],
    enemies: [],
    level: level1,
    distance: 0,
    pixelDistance: 0,
    maxPos: 0,
    gameOver: { status: false, opacity: 0 },

    intervalId: undefined,

    init() {
        this.setContext()
        this.gameLoop()
        this.createFloorBlocks()
        this.filterFloorBlocks()
        this.createCube()
        this.setEventHandlers()
        // optional
        this.createEnemies()
    },

    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d')
    },

    createCube() {
        this.cube = new Cube(this.ctx, 70, 60, this.floorBlocks, this.enemies, this.doggysArray)
    },

    createFloorBlocks() {

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
                    this.floorBlocks.push(new FloorBlock(this.ctx, (j + contador) * 50, i * 50))
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
        this.doggysArray = this.floorBlocks.filter(elm => (elm instanceof Doggy)) as Array<Doggy>
        this.obstaclesArray = this.floorBlocks.filter(elm => ((elm instanceof BubbleHole) || (elm instanceof Spike) || (elm instanceof TempSpike))) as Array<BubbleHole | Spike | TempSpike>
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
            // ENEMIES
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
            this.floorBlocks.forEach((elm, i) => {
                if (elm instanceof TempSpike) {
                    elm.move()
                    if (i === 36) console.log(elm.movedDistance)
                    // if (this.frameIndex >= 100 && this.frameIndex <= 150) {
                    //     elm.moveUp()
                    // } else if (this.frameIndex >= 250 && this.frameIndex <= 300) {
                    //     elm.moveDown()
                    // }
                }
                if (elm instanceof BrokenPlatform) {
                    if (elm.isBroken) {
                        elm.break()
                    }
                }
                elm.drawBlock()
            })

            // DOGGYS
            this.doggysArray.forEach((elm, i) => {
                if (elm.initialPos.x < this.cube!.cubePos.x + this.pixelDistance ||
                    elm.initialPos.x - 350 > this.cube!.cubePos.x + this.pixelDistance) {
                    elm.isActive = false
                } else {
                    elm.isActive = true
                }
                if (elm.isActive) elm.canMove = true
            })

            this.updateDistance()
            this.printDistance()
            if (this.gameOver.status) this.printGameOverScreen()
            // this.drawTriangle()
            // console.log('hola')
        }, 1000 / 60)
    },

    // --- COLLISIONS
    checkCollision() {

        this.doggysArray.forEach(elm => {
            if (this.cube!.cubePos.x < elm.floorPos.x + elm.width &&
                this.cube!.cubePos.x + this.cube!.cubeSize.w > elm.floorPos.x &&
                this.cube!.cubePos.y < elm.floorPos.y + elm.height &&
                this.cube!.cubeSize.h + this.cube!.cubePos.y > elm.floorPos.y) {
                this.setGameOver()
            }
        })

        this.obstaclesArray.forEach(elm => {
            if (elm instanceof (Spike || TempSpike)) {
                if (this.cube!.cubePos.x + 10 < elm.floorPos.x + elm.width &&
                    this.cube!.cubePos.x + this.cube!.cubeSize.w - 10 > elm.floorPos.x &&
                    this.cube!.cubePos.y + 12.5 < elm.floorPos.y + elm.height &&
                    this.cube!.cubeSize.h + this.cube!.cubePos.y > elm.floorPos.y) {
                    this.setGameOver()
                }
            } else {
                if (this.cube!.cubePos.x < elm.floorPos.x + elm.width &&
                    this.cube!.cubePos.x + this.cube!.cubeSize.w > elm.floorPos.x &&
                    this.cube!.cubePos.y < elm.floorPos.y + elm.height &&
                    this.cube!.cubeSize.h + this.cube!.cubePos.y > elm.floorPos.y) {
                    this.setGameOver()
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
        this.pixelDistance = -platformPosReference

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
        this.ctx?.clearRect(0, 0, 1800, 500)
    },


    // --- CONTROLS
    setEventHandlers() {
        document.addEventListener('keydown', event => {
            const { key } = event

            if (key === 'ArrowUp') this.cube!.jump()
            if (key === 'ArrowLeft') this.cube!.leftKey = true
            if (key === 'ArrowRight') this.cube!.rightKey = true
            if (key === 'ArrowDown') {
                console.log('POSICION DEL CUBO', this.cube!.cubePos.x)
                console.log('DISTANCIA EN PIXELES', this.pixelDistance)

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
    },

    setGameOver() {
        console.log('GAME OVER BIATCH')
        this.gameOver.status = true
    },

    printGameOverScreen() {
        this.ctx!.globalAlpha = this.gameOver.opacity
        this.ctx!.fillStyle = 'black'
        this.ctx!.fillRect(0, 0, 1800, 500)
        this.ctx!.globalAlpha = 1
        this.gameOver.opacity += 0.01

        if (this.gameOver.opacity >= 0.40) {
            this.ctx!.font = '30px sans-serif'
            this.ctx!.fillStyle = '#ffffff'
            this.ctx!.fillText('GAME OVER', 450, 200)

        }

        if (this.gameOver.opacity >= 1) clearInterval(this.intervalId)

    }

}



// HASTA AQUÍ PUEDES BORRAR QUERIDO