interface gameTemplate {
    authors: string

    canvas: HTMLCanvasElement
    ctx: null | CanvasRenderingContext2D

    framesCounter: number

    cube: undefined | Cube
    floorBlocks: Array<MapBlock>
    obstacles: Array<BubbleHole | Spike | TempSpike>
    doggies: Array<Doggy>
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

    shootAudio: any
    jumpAudio: any
    deathAudio: any
    backgroundMusicAudio: any
    lightAudio: any
    invisibilityAudio: any
    bubblesAudio: any

    startButton: null | HTMLButtonElement

    intervalId: number | undefined


    init(): void
    setContext(): void
    scroll(): void
    applyScroll(elm: any): void
    setEventHandlers(): void

    setSounds(): void
    playAudio(sound: any): void
    playBubbleAudio(): void

    gameLoop(): void
    clearAll(): void

    // Create Elements
    createCube(): void
    createMap(): void
    createSpotlights(): void
    createPowerUps(): void

    // Update Elements inside GameLoop
    updateCube(): void
    updateSpotlights(): void
    updateDoggies(): void
    updateMapBlocks(): void
    updateObstacles(): void
    updatePowerUps(): void

    // Collisions
    checkDoggyCollision(): void
    checkObstacleCollision(): void
    checkLightCollision(): void
    checkBulletCollision(): void
    checkCollision(r1: any, r2: any): boolean
    checkAllCollisions(): void

    // Active PowerUps
    activeInvisibleCube(): void
    activeTurnLightsOff(): void

    // Travelled Distance
    updateDistance(): void
    printDistance(): void

    // Win and Lose Scenario
    getGameOverOrWinImageInstance(): void
    setGameOver(): void
    printGameOverScreen(): void
    checkWin(): void
    printVictoryScreen(): void

    resetGame(): void
}

const squbeDarkness: gameTemplate = {
    authors: 'Guillermo Ávila & Inés García',

    canvas: document.querySelector('#myCanvas') as HTMLCanvasElement,
    ctx: null,

    framesCounter: 0,

    cube: undefined,
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
    jumpAudio: undefined,
    deathAudio: undefined,
    backgroundMusicAudio: undefined,
    lightAudio: undefined,
    invisibilityAudio: undefined,
    bubblesAudio: undefined,

    imageInstanceGameOver: new Image(),
    imageInstanceWinner: new Image(),

    intervalId: undefined,

    startButton: document.querySelector('button'),

    init() {
        this.setContext()
        this.gameLoop()
        this.createMap()
        this.createCube()
        this.createSpotlights()
        this.createPowerUps()
        this.setEventHandlers()
        this.getGameOverOrWinImageInstance()
        this.setSounds()
        this.resetGame()
    },

    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d')
    },

    createCube() {
        this.cube = new Cube(this.ctx, 400, 450, this.floorBlocks)
    },

    createMap() {
        this.level.forEach((row, i) => {
            let counter: number = 0
            row.forEach((cell, j) => {
                if (cell === 1) {
                    this.floorBlocks.push(new MapBlock(this.ctx, (j + counter) * 50, i * 50))
                } else if (cell === 2) {
                    this.obstacles.push(new BubbleHole(this.ctx, (j + counter) * 50, i * 50))
                } else if (cell === 3) {
                    this.doggies.push(new Doggy(this.ctx, (j + counter) * 50, i * 50))
                } else if (cell === 4) {
                    this.obstacles.push(new TempSpike(this.ctx, (j + counter) * 50, i * 50))
                } else if (cell === 5) {
                    this.obstacles.push(new Spike(this.ctx, (j + counter) * 50, i * 50))
                } else if (cell === 6) {
                    this.floorBlocks.push(new BrokenPlatform(this.ctx, (j + counter) * 50, i * 50))
                    counter++
                }
            })
        })
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
        this.turnOffLightsPowerUp = new TurnOffLights(this.ctx, 1650, 170)
    },


    // --- INTERVAL
    gameLoop() {
        this.intervalId = setInterval(() => {

            this.clearAll()

            // Set Up
            this.backgroundMusicAudio.play()
            this.framesCounter >= 600 ? this.framesCounter = 0 : this.framesCounter++
            this.scroll()

            // Update Elements
            this.updateCube()
            this.updateSpotlights()
            this.updateMapBlocks()
            this.updateObstacles()
            this.updateDoggies()
            this.updatePowerUps()
            this.updateDistance()

            // Collisions
            this.checkAllCollisions()

            // Win and Lose Scenario
            if (this.gameOver.status) this.printGameOverScreen()
            this.checkWin()
        }, 1000 / 60)
    },

    // --- UPDATE FUNCTIONS
    updateCube() {
        this.cube?.draw()
        this.cube?.spinRight(this.framesCounter)
        this.cube?.spinLeft(this.framesCounter)
        if (this.cube?.isDead) this.cube?.animate(this.framesCounter)
        this.cube?.movement()
    },

    updateMapBlocks() {
        this.floorBlocks.forEach(elm => {
            if (elm instanceof BrokenPlatform) {
                elm.drawPlatform(this.framesCounter)
                if (elm.isBroken) elm.break()
            } else {
                elm.draw()
            }
        })
    },

    updateObstacles() {
        this.obstacles.forEach(elm => {
            if (elm instanceof TempSpike) {
                elm.move()
            }
            elm.draw(this.framesCounter)
        })
        this.playBubbleAudio()
    },

    updateSpotlights() {
        this.spotlights.forEach(spotlight => {
            if (spotlight.light?.isOn) spotlight.light?.draw()
            spotlight.setImageSrc()
            spotlight.draw(this.framesCounter)
            spotlight.move()
            spotlight.light?.move()
            spotlight.bullets.forEach(bullet => {
                bullet.draw()
                bullet.move()
            });
        })
    },

    updateDoggies() {
        this.doggies.forEach((elm, i) => {
            elm.draw(this.framesCounter)
            if (elm.maxPosX.r < this.cube!.pos.x + this.pixelDistance ||
                elm.maxPosX.l > this.cube!.pos.x + this.pixelDistance) {
                elm.isActive = false
            } else {
                elm.isActive = true
            }
            if (elm.isActive) elm.canMove = true
        })
    },

    updatePowerUps() {
        this.invisibleCubePowerUp?.draw()
        this.turnOffLightsPowerUp?.draw()

        this.ctx!.fillText('Press Z', 1652, 150)
        this.ctx!.fillText('Press X', 1652, 270)
    },

    // --- COLLISIONS
    checkDoggyCollision() {
        this.doggies.forEach(doggy => {
            if (this.checkCollision(this.cube, doggy)) this.setGameOver()
        })
    },

    checkObstacleCollision() {
        this.obstacles.forEach(obstacle => {
            if (this.checkCollision(this.cube, obstacle)) this.setGameOver()
        })
    },


    checkLightCollision(): void {
        this.spotlights.forEach(spotlight => {
            if (spotlight.light!.isOn && !this.cube!.isHidding) {

                if (this.checkCollision(this.cube, spotlight.light)) {

                    this.cube!.isFound = true
                    spotlight.shoot(this.framesCounter)

                } else {
                    this.cube!.isFound = false
                }
            }
        })
    },

    checkBulletCollision() {

        this.spotlights.forEach(spotlight => {
            spotlight.bullets.forEach(bullet => {

                if (this.checkCollision(this.cube, bullet)) {
                    this.setGameOver()
                }

                this.floorBlocks.forEach(block => {
                    if (this.checkCollision(block, bullet)) {
                        this.playAudio(this.shootAudio)
                        const indexOfBulletToRemove: number = spotlight.bullets.indexOf(bullet)
                        spotlight.deleteCollisionedBullet(indexOfBulletToRemove)
                    }
                })
            })
        })
    },

    checkCollision(r1, r2) {
        if (r2 instanceof (Spike || TempSpike)) {

            if (r1.pos.x < r2.pos.x + r2.size.w &&
                r1.pos.x + r1.size.w - 30 > r2.pos.x &&
                r1.pos.y < r2.pos.y + r2.size.h &&
                r1.size.h + r1.pos.y - 22.5 > r2.pos.y) {
                return true
            }

        } else {

            if (r1.pos.x < r2.pos.x + r2.size.w &&
                r1.pos.x + r1.size.w - 21 > r2.pos.x &&
                r1.pos.y + 11 < r2.pos.y + r2.size.h &&
                r1.size.h + r1.pos.y - 11 > r2.pos.y) {
                return true
            }
        }

        return false
    },

    checkAllCollisions() {
        if (!this.invisibleCubePowerUp?.isActive) {
            this.checkLightCollision()
            this.checkBulletCollision()
            if (!this.cube!.isDead) {
                this.checkDoggyCollision()
                this.checkObstacleCollision()
            }
        }
    },

    // --- POWERUPS
    activeInvisibleCube() {
        if (this.invisibleCubePowerUp?.isAvailable) {

            this.invisibilityAudio.play()

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

            this.lightAudio.play()

            this.turnOffLightsPowerUp!.isActive = true
            this.spotlights.forEach(spotlight => spotlight.light!.isOn = false)
            this.cube!.isFound = false

            setTimeout(() => {
                this.turnOffLightsPowerUp!.isActive = false
                this.spotlights.forEach(spotlight => spotlight.light!.isOn = true)
                this.lightAudio.play()
            }, 5000)
        }
    },

    // --- SCROLL
    scroll() {
        if (this.cube!.pos.x >= 400) {

            this.floorBlocks.forEach(block => this.applyScroll(block))
            this.obstacles.forEach(obstacle => this.applyScroll(obstacle))
            this.doggies.forEach(doggy => this.applyScroll(doggy))

            this.spotlights.forEach(spotlight => {
                this.applyScroll(spotlight)
                this.applyScroll(spotlight.light!)
                spotlight.bullets.forEach(bullet => this.applyScroll(bullet))

                // keep spotlight movement range
                spotlight.maxPosX.l += -this.cube!.vel.x
                spotlight.maxPosX.r += -this.cube!.vel.x
            })
        }
    },

    applyScroll(elm) {
        if (elm instanceof Spotlight || elm instanceof Light || elm instanceof Bullet) {
            elm.pos.x += -this.cube!.vel.x
            elm.pos.y += -this.cube!.vel.y
        } else {
            if (!this.cube!.isDead) elm.pos.x += -this.cube!.vel.x
            elm.pos.y += -this.cube!.vel.y
        }
    },

    // --- DISTANCE
    updateDistance() {

        let platformPosReference: number = this.floorBlocks[0].pos.x
        this.pixelDistance = -platformPosReference

        if (platformPosReference < this.maxPos) {
            this.distance += 1.5
            this.maxPos = platformPosReference
        }

        this.printDistance()
    },

    printDistance() {
        this.ctx!.font = '30px Sans-serif'
        this.ctx!.fillStyle = 'white'
        if (this.distance * 0.026458 < 10) {
            this.ctx!.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 1652, 320)
        } else if ((this.distance * 0.026458 > 10)
            && (this.distance * 0.026458 < 100)) {
            this.ctx!.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 1636, 320)
        } else {
            this.ctx!.fillText(`${(this.distance * 0.026458).toFixed(2)}`, 1620, 320)
        }

        this.ctx!.font = '20px Sans-serif'
        this.ctx!.fillText('m', 1715, 320)
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
                if (key === 'ArrowUp') {
                    this.cube!.jump()
                    this.jumpAudio.currentTime = 5
                    this.jumpAudio.play()
                }
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

    // --- WIN AND LOSE SCENARIO
    getGameOverOrWinImageInstance() {
        this.imageInstanceGameOver.src = './images/gameover.png'
        this.imageInstanceWinner.src = './images/winner.png'
    },

    setGameOver() {
        this.cube!.canMove = false
        this.gameOver.status = true
        this.cube!.isDead = true
        this.deathAudio.play()

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
            this.ctx!.drawImage(this.imageInstanceWinner, 900 - (200 * this.win.opacity / 2), 300, 200 * this.win.opacity, 50 * this.win.opacity)
        }

        if (this.win.opacity >= 1) clearInterval(this.intervalId)
    },

    setSounds() {
        this.backgroundMusicAudio = new Audio('./sounds/background-music.mp3')
        this.backgroundMusicAudio.volume = 0.2
        this.shootAudio = new Audio('./sounds/shoot.wav')
        this.shootAudio.volume = 0.1
        this.lightAudio = new Audio('./sounds/light.wav')
        this.lightAudio.volume = 0.1
        this.invisibilityAudio = new Audio('./sounds/invisibility.wav')
        this.invisibilityAudio.volume = 0.1
        this.jumpAudio = new Audio('./sounds/jump2.mp3')
        this.jumpAudio.volume = 0.05
        this.deathAudio = new Audio('./sounds/death.wav')
        this.deathAudio.volume = 0.1
        this.bubblesAudio = new Audio('./sounds/oceanbubbles.wav')
        this.bubblesAudio.volume = 0.1
    },

    playAudio(sound) {
        sound.currentTime = 0
        sound.play()
    },

    playBubbleAudio(): void {
        this.obstacles.forEach((elm, i) => {
            if (elm instanceof BubbleHole) {

                if (elm.initialPos.x + 100 > this.cube!.pos.x + this.pixelDistance &&
                    elm.initialPos.x - 100 < this.cube!.pos.x + this.pixelDistance) {
                    this.bubblesAudio.play()
                }
            }
        })
    },

    resetGame() {
        this.startButton?.addEventListener('click', () => {
            window.location.reload()
        })
    }

}