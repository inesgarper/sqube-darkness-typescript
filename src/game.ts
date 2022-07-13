interface gameTemplate {
    authors: string,

    canvas: HTMLCanvasElement
    ctx: null | CanvasRenderingContext2D,

    frameIndex: number,

    cube: undefined | Cube,
    floorBlocks: Array<FloorBlock>,

    keyPressed: Array<string>,
    intervalId: number | undefined

    init(): void
    setContext(): void
    createCube(): void
    createFloorBlocks(): void
    setEventHandlers(): void
    movement(): void
    drawAll(): void
    clearAll(): void
    checkFloorCollision(): boolean

}

const squbeDarkness: gameTemplate = {
    authors: 'Guillermo Ávila & Inés García',

    canvas: document.querySelector('#myCanvas') as HTMLCanvasElement,
    ctx: null,

    frameIndex: 0,

    cube: undefined,
    floorBlocks: [],

    keyPressed: [],
    intervalId: undefined,

    init() {
        this.setContext()
        this.createCube()
        this.setEventHandlers()
        this.movement()
        this.createFloorBlocks()
        this.drawAll()
        this.checkFloorCollision()

    },

    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d')
    },

    createCube() {
        this.cube = new Cube(this.ctx, 40, 60)
    },

    createFloorBlocks() {
        this.floorBlocks.push(
            new FloorBlock(this.ctx, 0, 450, 300, 50),
            new FloorBlock(this.ctx, 300, 400, 300, 100),
            new FloorBlock(this.ctx, 600, 200, 100, 50)
        )
    },

    // --- INTERVAL
    drawAll() {
        this.intervalId = setInterval(() => {
            this.clearAll()
            this.frameIndex++
            this.cube?.drawCube()
            this.movement()
            this.floorBlocks.forEach(elm => elm.drawFloor())
            if (this.checkFloorCollision()) {
                this.cube!.cubeVel.y = 0
                this.cube!.cubePhysics.gravity = 0
            } else {
                this.cube!.cubePhysics.gravity = 0.5
            }
        }, 1000 / 60)
    },

    // --- CLEAR SCREEN
    clearAll() {
        this.ctx?.clearRect(0, 0, 1200, 500)
    },

    // --- COLLISIONS
    checkFloorCollision() {

        return this.floorBlocks.some((elm) => {
            return this.cube!.cubePos.x < elm.floorPos.x + elm.floorSize.w &&
                this.cube!.cubePos.x + this.cube!.cubeSize.w > elm.floorPos.x &&
                this.cube!.cubePos.y < elm.floorPos.y + elm.floorSize.h &&
                this.cube!.cubeSize.h + this.cube!.cubePos.y > elm.floorPos.y
        })

        // this.floorBlocks.forEach(elm => {
        //     if (this.cube!.cubePos.x < elm.floorPos.x + elm.floorSize.w &&
        //         this.cube!.cubePos.x + this.cube!.cubeSize.w > elm.floorPos.x &&
        //         this.cube!.cubePos.y < elm.floorPos.y + elm.floorSize.h &&
        //         this.cube!.cubeSize.h + this.cube!.cubePos.y > elm.floorPos.y
        //     ) {
        //         this.cube!.cubeIsOnSurface = true
        //         this.cube!.cubeVel.y = 0
        //         this.cube!.cubePhysics.gravity = 0
        //     } else {
        //         this.cube!.cubeIsOnSurface = false
        //         this.cube!.cubePhysics.gravity = 0.5
        //     }
        // })
    },

    // --- CONTROLS
    movement() {
        this.keyPressed.forEach(elm => {
            if (elm.includes('ArrowRight')) this.cube?.moveRight()
            if (elm.includes('ArrowLeft')) this.cube?.moveLeft()
        })
    },

    setEventHandlers() {
        document.addEventListener('keydown', event => {
            const { key } = event

            if (key === 'ArrowUp') this.cube?.jump()
            if (key === 'ArrowRight' && !(this.keyPressed.includes('ArrowRight'))) this.keyPressed.push('ArrowRight')
            else if (key === 'ArrowLeft' && !(this.keyPressed.includes('ArrowLeft'))) this.keyPressed.push('ArrowLeft')
        })

        document.addEventListener('keyup', event => {
            const { key } = event

            if (key === 'ArrowRight') this.keyPressed = []
            else if (key === 'ArrowLeft') this.keyPressed = []
            else return null
        })
    },

}

