interface gameTemplate {
    authors: string

    canvas: HTMLCanvasElement
    ctx: null | CanvasRenderingContext2D

    framesCounter: number

    cube: undefined | Cube
    floorBlocks: Array<Cell | Doggy>
    doggysArray: Array<Doggy>
    obstaclesArray: Array<Cell>
    spotlights: Array<Spotlight>
    invisibleCubePowerUp: undefined | InvisibleCube
    turnOffLightsPowerUp: undefined | TurnOffLights
    level: Array<Array<number>>
    distance: number
    maxPos: number
    pixelDistance: number
    gameOver: { status: boolean, opacity: number }
    win: { status: boolean, opacity: number }
    imageInstanceGameOver: any
    imageInstanceWinner: any

    intervalId: number | undefined


    init(): void
    setContext(): void
    createCube(): void
    createFloorBlocks(): void
    filterFloorBlocks(): void
    createSpotlights(): void
    createPowerUps(): void
    setEventHandlers(): void
    getImageInstance(): void
    gameLoop(): void
    clearAll(): void
    updateDistance(): void
    printDistance(): void
    checkCollision(): void
    checkLightCollision(): void
    checkBulletCollision(): void
    activeInvisibleCube(): void
    activeTurnLightsOff(): void
    setGameOver(): void
    printGameOverScreen(): void
    checkWin(): void
    printVictoryScreen(): void

}

const squbeDarkness: gameTemplate = {
    authors: 'Guillermo Ávila & Inés García',

    canvas: document.querySelector('#myCanvas') as HTMLCanvasElement,
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

    imageInstanceGameOver: new Image(),
    imageInstanceWinner: new Image(),

    intervalId: undefined,

    init() {
        this.setContext()
        this.gameLoop()
        this.createFloorBlocks()
        this.filterFloorBlocks()
        this.createCube()
        this.createSpotlights()
        this.createPowerUps()
        this.setEventHandlers()
        this.getImageInstance()
    },

    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d')
    },

    createCube() {
        this.cube = new Cube(this.ctx, 400, 450, this.floorBlocks, this.spotlights)
    },

    createFloorBlocks() {

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
    },

    filterFloorBlocks() {
        this.doggysArray = this.floorBlocks.filter(elm => (elm instanceof Doggy)) as Array<Doggy>
        this.obstaclesArray = this.floorBlocks.filter(elm => ((elm instanceof BubbleHole) || (elm instanceof Spike) || (elm instanceof TempSpike))) as Array<BubbleHole | Spike | TempSpike>
    },

    createSpotlights() {
        this.spotlights.push(
            new Spotlight(this.ctx, 1300, 150, 900, 2100, 'left', this.cube!, this.floorBlocks),
            new Spotlight(this.ctx, 3250, 100, 2500, 3900, 'right', this.cube!, this.floorBlocks),
            new Spotlight(this.ctx, 5300, 100, 4900, 5700, 'left', this.cube!, this.floorBlocks),
            new Spotlight(this.ctx, 7350, 70, 6800, 7900, 'right', this.cube!, this.floorBlocks),
            new Spotlight(this.ctx, 9350, 30, 8800, 9900, 'left', this.cube!, this.floorBlocks),
            new Spotlight(this.ctx, 11500, 150, 10700, 12300, 'right', this.cube!, this.floorBlocks),
            new Spotlight(this.ctx, 12300, 100, 11900, 12700, 'left', this.cube!, this.floorBlocks),
        )
    },

    createPowerUps() {
        this.invisibleCubePowerUp = new InvisibleCube(this.ctx, 1650, 50)
        this.turnOffLightsPowerUp = new TurnOffLights(this.ctx, 1650, 150)
    },

    // --- INTERVAL
    gameLoop() {
        this.intervalId = setInterval(() => {
            this.clearAll()
            this.framesCounter >= 600 ? this.framesCounter = 0 : this.framesCounter++
            this.setEventHandlers()
            this.cube?.draw()
            this.cube?.spinRight(this.framesCounter)
            this.cube?.spinLeft(this.framesCounter)
            if (this.cube?.isDead) this.cube?.animate(this.framesCounter)
            this.cube?.movement()
            if (!this.invisibleCubePowerUp?.isActive) {
                this.checkLightCollision()
                if (!this.cube!.isDead) this.checkCollision()
                this.checkBulletCollision()
            }
            // SPOTLIGHTS
            this.spotlights.forEach(elm => {
                if (elm.light?.isOn) {
                    elm.light?.draw()
                    elm.imageInstance.src = './images/spotlight/spotlight.png'
                } else {
                    elm.imageInstance.src = './images/spotlight/spotlight-off.png'
                }
                elm.light?.move()
                elm.draw(this.framesCounter)
                elm.move()
                elm.bullets.forEach(bullet => {
                    bullet.draw()
                    bullet.move()
                });
            })
            this.floorBlocks.forEach((elm, i) => {
                if (elm instanceof TempSpike) {
                    elm.move()
                }
                if (elm instanceof BrokenPlatform) {
                    if (elm.isBroken) {
                        elm.break()
                    }
                }
                elm.drawBlock(this.framesCounter)
            })

            // DOGGIES
            this.doggysArray.forEach((elm, i) => {
                if (elm.initialPos.x < this.cube!.cubePos.x + this.pixelDistance ||
                    elm.initialPos.x - 350 > this.cube!.cubePos.x + this.pixelDistance) {
                    elm.isActive = false
                } else {
                    elm.isActive = true
                }
                if (elm.isActive) elm.canMove = true
            })
            this.invisibleCubePowerUp?.draw()
            this.turnOffLightsPowerUp?.draw()
            this.updateDistance()
            this.printDistance()
            if (this.gameOver.status) this.printGameOverScreen()
            this.checkWin()
        }, 1000 / 60)
    },

    // --- COLLISIONS
    checkCollision() {

        this.doggysArray.forEach(elm => {
            if (this.cube!.cubePos.x < elm.floorPos.x + elm.width &&
                this.cube!.cubePos.x + this.cube!.cubeSize.w - 20 > elm.floorPos.x &&
                this.cube!.cubePos.y < elm.floorPos.y + elm.height &&
                this.cube!.cubeSize.h + this.cube!.cubePos.y > elm.floorPos.y) {

                // this.setGameOver()
            }
        })

        this.obstaclesArray.forEach(elm => {
            if (elm instanceof (Spike || TempSpike)) {
                if (this.cube!.cubePos.x < elm.floorPos.x + elm.width &&
                    this.cube!.cubePos.x + this.cube!.cubeSize.w - 30 > elm.floorPos.x &&
                    this.cube!.cubePos.y < elm.floorPos.y + elm.height &&
                    this.cube!.cubeSize.h + this.cube!.cubePos.y - 22.5 > elm.floorPos.y) {
                    // this.setGameOver()
                }
            } else {
                if (this.cube!.cubePos.x < elm.floorPos.x + elm.width &&
                    this.cube!.cubePos.x + this.cube!.cubeSize.w > elm.floorPos.x &&
                    this.cube!.cubePos.y < elm.floorPos.y + elm.height &&
                    this.cube!.cubeSize.h + this.cube!.cubePos.y > elm.floorPos.y) {
                    // this.setGameOver()
                    this.printVictoryScreen()

                }
            }
        })

    },

    checkLightCollision(): void {

        this.spotlights.forEach(spotlight => {


            if (spotlight.light!.isOn && !this.cube!.isHidding) {

                if (this.cube!.cubePos.x < spotlight.light!.lightPos.x + spotlight.light!.lightSize.w &&
                    this.cube!.cubePos.x + this.cube!.cubeSize.w > spotlight.light!.lightPos.x &&
                    this.cube!.cubePos.y < spotlight.light!.lightPos.y + spotlight.light!.lightSize.h &&
                    this.cube!.cubeSize.h + this.cube!.cubePos.y > spotlight.light!.lightPos.y) {

                    this.cube!.isFound = true

                    if (this.cube!.isFound) {

                        if (this.framesCounter % 30 === 0) spotlight.shoot()

                    }

                } else {
                    this.cube!.isFound = false
                }
            }

        })
    },

    checkBulletCollision(): void {

        this.spotlights.forEach(spotlight => {

            spotlight.bullets.forEach(bullet => {
                if (this.cube!.cubePos.x < bullet.bulletPos.x + bullet.bulletSize.w &&
                    this.cube!.cubePos.x + this.cube!.cubeSize.w > bullet.bulletPos.x &&
                    this.cube!.cubePos.y < bullet.bulletPos.y + bullet.bulletSize.h &&
                    this.cube!.cubeSize.h + this.cube!.cubePos.y > bullet.bulletPos.y) {
                    // this.setGameOver()
                }

                this.floorBlocks.forEach(block => {
                    if (block.floorPos.x < bullet.bulletPos.x + bullet.bulletSize.w &&
                        block.floorPos.x + block.width > bullet.bulletPos.x &&
                        block.floorPos.y < bullet.bulletPos.y + bullet.bulletSize.h &&
                        block.height + block.floorPos.y > bullet.bulletPos.y) {

                        const indexOfBulletToRemove: number = spotlight.bullets.indexOf(bullet)
                        spotlight.deleteCollisionedBullet(indexOfBulletToRemove)
                    }
                })
            })

        })

    },

    // --- POWERUPS
    activeInvisibleCube() {
        if (this.invisibleCubePowerUp?.isAvailable) {

            this.invisibleCubePowerUp!.isActive = true
            this.cube!.isInvisible = true
            this.cube!.isFound = false

            setTimeout(() => {
                this.invisibleCubePowerUp!.isActive = false
                this.cube!.isInvisible = false
            }, 5000)
        }
    },

    activeTurnLightsOff() {
        if (this.turnOffLightsPowerUp?.isAvailable) {

            this.turnOffLightsPowerUp!.isActive = true
            this.spotlights.forEach(spotlight => spotlight.light!.isOn = false)
            this.cube!.isFound = false

            setTimeout(() => {
                this.turnOffLightsPowerUp!.isActive = false
                this.spotlights.forEach(spotlight => spotlight.light!.isOn = true)
            }, 5000)
        }
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
        this.ctx!.font = '30px Sans-serif'
        this.ctx!.fillStyle = 'white'
        if (this.distance * 0.026458 < 10) {
            this.ctx!.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 1652, 300)
        } else if ((this.distance * 0.026458 > 10)
            && (this.distance * 0.026458 < 100)) {
            this.ctx!.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 1636, 300)
        } else {
            this.ctx!.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 1620, 300)
        }

        this.ctx!.font = '20px Sans-serif'
        this.ctx!.fillText('m', 1715, 300)

    },

    // --- CLEAR SCREEN
    clearAll() {
        this.ctx?.clearRect(0, 0, 1800, 900)
    },

    // --- CONTROLS
    setEventHandlers() {
        document.addEventListener('keydown', event => {
            const { key } = event
            if (!this.cube!.isDead) {
                if (key === 'ArrowUp') this.cube!.jump()
                if (key === 'ArrowLeft') {
                    if (!this.cube!.isDead) {
                        this.cube!.leftKey = true
                    }
                }
                if (key === 'ArrowRight') {
                    if (!this.cube!.isDead) {
                        this.cube!.rightKey = true
                    }
                }
                if (key === 'z') {
                    this.activeInvisibleCube()
                    this.invisibleCubePowerUp!.isAvailable = false
                }
                if (key === 'x') {
                    this.activeTurnLightsOff()
                    this.turnOffLightsPowerUp!.isAvailable = false
                }
            }
        })

        document.addEventListener('keyup', event => {
            const { key } = event

            if (key === 'ArrowLeft') this.cube!.leftKey = false
            if (key === 'ArrowRight') this.cube!.rightKey = false
        })
    },

    getImageInstance(): void {
        this.imageInstanceGameOver.src = './images/gameover.png'
        this.imageInstanceWinner.src = './images/winner.png'
    },

    setGameOver() {
        this.cube!.canMove = false
        this.gameOver.status = true
        this.cube!.isDead = true
    },

    printGameOverScreen() {

        this.ctx!.globalAlpha = this.gameOver.opacity
        this.ctx!.fillStyle = 'black'
        this.ctx!.fillRect(0, 0, 1800, 800)
        this.ctx!.globalAlpha = 1
        this.gameOver.opacity += 0.02

        if (this.gameOver.opacity >= 0.40) {
            this.ctx!.drawImage(this.imageInstanceGameOver, 900 - (275 * this.gameOver.opacity / 2), 300, 275 * this.gameOver.opacity, 50 * this.gameOver.opacity)

            this.ctx!.fillStyle = '#919191'
            this.ctx!.font = '30px sans-serif'

            if (this.gameOver.opacity >= 1) {
                if (this.distance * 0.026458 < 10) {
                    this.ctx!.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 856, 400)
                    this.ctx!.fillText('m', 926, 400)
                } else if ((this.distance * 0.026458 > 10)
                    && (this.distance * 0.026458 < 100)) {
                    this.ctx!.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 845, 400)
                    this.ctx!.fillText('m', 931, 400)
                } else {
                    this.ctx!.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 834, 400)
                    this.ctx!.fillText('m', 936, 400)
                }
            }

        }

        // linea roja centro del canvas
        this.ctx!.beginPath();
        this.ctx!.moveTo(900, 0);
        this.ctx!.lineTo(900, 800);
        this.ctx!.stroke();
        this.ctx!.strokeStyle = '#ff0000'

        // borrar intervalo
        if (this.gameOver.opacity >= 1) clearInterval(this.intervalId)

    },

    checkWin() {
        if (this.distance * 0.026458 > 103) this.printVictoryScreen()
    },

    printVictoryScreen() {
        this.ctx!.globalAlpha = this.win.opacity
        this.ctx!.fillStyle = 'black'
        this.ctx!.fillRect(0, 0, 1800, 800)
        this.ctx!.globalAlpha = 1
        this.win.opacity += 0.01

        if (this.win.opacity >= 0.40) {
            this.ctx!.drawImage(this.imageInstanceWinner, 900 - (200 * this.gameOver.opacity / 2), 300, 275 * this.gameOver.opacity, 50 * this.gameOver.opacity)
        }

        if (this.win.opacity >= 1) clearInterval(this.intervalId)
    }

}