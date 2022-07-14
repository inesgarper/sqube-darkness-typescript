interface gameTemplate {
    authors: string

    canvas: HTMLCanvasElement
    ctx: null | CanvasRenderingContext2D

    frameIndex: number

    cube: undefined | Cube
    floorBlocks: Array<FloorBlock>

    intervalId: number | undefined

    init(): void
    setContext(): void
    createCube(): void
    createFloorBlocks(): void
    setEventHandlers(): void
    drawAll(): void
    clearAll(): void

}

const squbeDarkness: gameTemplate = {
    authors: 'Guillermo Ávila & Inés García',

    canvas: document.querySelector('#myCanvas') as HTMLCanvasElement,
    ctx: null,

    frameIndex: 0,

    cube: undefined,
    floorBlocks: [],

    intervalId: undefined,

    init() {
        this.setContext()
        this.createCube()
        this.setEventHandlers()
        this.createFloorBlocks()
        this.drawAll()
    },

    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d')
    },

    createCube() {
        this.cube = new Cube(this.ctx, 40, 60, this.floorBlocks)
    },

    createFloorBlocks() {
        this.floorBlocks.push(
            new FloorBlock(this.ctx, 0, 450, 300, 50),
            new FloorBlock(this.ctx, 300, 400, 300, 100),
            new FloorBlock(this.ctx, 600, 450, 200, 50),
            new FloorBlock(this.ctx, 800, 250, 100, 300)
        )
    },

    // --- INTERVAL
    drawAll() {
        this.intervalId = setInterval(() => {
            this.clearAll()
            this.frameIndex++
            this.setEventHandlers()
            this.cube?.draw()
            this.cube?.movement()
            this.floorBlocks.forEach(elm => elm.drawFloor())
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

            if (key === 'ArrowUp') this.cube!.upKey = true
            if (key === 'ArrowLeft') this.cube!.leftKey = true
            if (key === 'ArrowRight') this.cube!.rightKey = true
        })

        document.addEventListener('keyup', event => {
            const { key } = event

            if (key === 'ArrowUp') this.cube!.upKey = false
            if (key === 'ArrowLeft') this.cube!.leftKey = false
            if (key === 'ArrowRight') this.cube!.rightKey = false
        })
    }

    // setEventHandlers() {
    //     document.addEventListener("keydown", event => {
    //         const { key } = event

    //         if (key === "ArrowUp") {
    //             squbeDarkness.cube!.upKey = true
    //         } else if (key === "ArrowLeft") {
    //             squbeDarkness.cube!.leftKey = true
    //         } else if (key === "ArrowDown") {
    //             squbeDarkness.cube!.downKey = true
    //         } else if (key === "ArrowRight") {
    //             squbeDarkness.cube!.rightKey = true
    //             console.log('HE PULSADO LA TECLA')
    //             console.log(`${squbeDarkness.rightKey}`)
    //         }
    //     })

    //     document.addEventListener("keyup", function (event) {
    //         const { key } = event

    //         if (key === "ArrowUp") {
    //             this.cube!.upKey = false
    //         } else if (key === "ArrowLeft") {
    //             squbeDarkness.leftKey = false
    //         } else if (key === "ArrowDown") {
    //             squbeDarkness.downKey = false
    //         } else if (key === "ArrowRight") {
    //             squbeDarkness.rightKey = false
    //         }
    //     })
    // }


    // setControls() {
    //     this.keyPressed.forEach(elm => {
    //         if (elm.includes('ArrowRight')) this.cube?.moveRight()
    //         if (elm.includes('ArrowLeft')) this.cube?.moveLeft()
    //     })
    // },


}

