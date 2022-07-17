interface gameTemplate {
    authors: string

    canvas: HTMLCanvasElement
    ctx: null | CanvasRenderingContext2D

    frameIndex: number

    cube: undefined | Cube
    floorBlocks: Array<FloorBlock>
    level: Array<Array<number>>

    intervalId: number | undefined


    init(): void
    setContext(): void
    createCube(): void
    createFloorBlocks(): void
    setEventHandlers(): void
    gameLoop(): void
    clearAll(): void

}

const squbeDarkness: gameTemplate = {
    authors: 'Guillermo Ávila & Inés García',

    canvas: document.querySelector('#myCanvas') as HTMLCanvasElement,
    ctx: null,

    frameIndex: 0,

    cube: undefined,
    floorBlocks: [],
    level: level1,

    intervalId: undefined,

    init() {
        this.setContext()
        this.createCube()
        this.setEventHandlers()
        this.createFloorBlocks()
        this.gameLoop()
    },

    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d')
    },

    createCube() {
        this.cube = new Cube(this.ctx, 70, 60, this.floorBlocks)
    },

    createFloorBlocks() {

        this.level.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell === 1) {
                    this.floorBlocks.push(new FloorBlock(this.ctx, j * 50, i * 50))
                } else if (cell === 2) {
                    this.floorBlocks.push(new BubbleHole(this.ctx, j * 50, i * 50))
                } else if (cell === 3) {
                    this.floorBlocks.push(new Doggy(this.ctx, j * 50, i * 50))
                } else if (cell === 4) {
                    this.floorBlocks.push(new TempSpike(this.ctx, j * 50, i * 50))
                } else if (cell === 5) {
                    this.floorBlocks.push(new Spike(this.ctx, j * 50, i * 50))
                } else if (cell === 6) {
                    this.floorBlocks.push(new BrokenPlatform(this.ctx, j * 50, i * 50))
                }
            })
        })
    },

    // --- INTERVAL
    gameLoop() {
        this.intervalId = setInterval(() => {
            this.clearAll()
            this.frameIndex++
            this.setEventHandlers()
            this.cube?.draw()
            this.cube?.movement()
            this.floorBlocks.forEach(elm => elm.drawBlock())
            // console.log('JUGADOR---->', this.cube!.cubePos.x + this.cube!.cubeSize.w)
            // console.log('PLATAFORMA--->', this.floorBlocks[3].floorPos.x)
        }, 1000 / 60)
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
            if (key === 'ArrowDown') console.log(this.cube?.cubePos)
        })

        document.addEventListener('keyup', event => {
            const { key } = event

            if (key === 'ArrowLeft') this.cube!.leftKey = false
            if (key === 'ArrowRight') this.cube!.rightKey = false
        })
    }


}

