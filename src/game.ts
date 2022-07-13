interface gameTemplate {
    authors: string,

    canvas: HTMLCanvasElement
    ctx: null | CanvasRenderingContext2D,

    frameIndex: number,

    cube: undefined | Cube,

    keyPressed: Array<string>,
    intervalId: number | undefined

    init(): void
    setContext(): void
    createCube(): void
    setEventHandlers(): void
    movement(): void
    drawAll(): void
    clearAll(): void

}

const squbeDarkness: gameTemplate = {
    authors: 'Guillermo Ávila & Inés García',

    canvas: document.querySelector('#myCanvas') as HTMLCanvasElement,
    ctx: null,

    frameIndex: 0,

    cube: undefined,

    keyPressed: [],
    intervalId: undefined,

    init() {
        this.setContext()
        this.createCube()
        this.setEventHandlers()
        this.movement()
        this.drawAll()
    },

    // --- SET UP
    setContext() {
        this.ctx = this.canvas.getContext('2d')
    },

    createCube() {
        this.cube = new Cube(this.ctx, 40, 60)
    },

    // --- INTERVAL
    drawAll() {
        this.intervalId = setInterval(() => {
            this.clearAll()
            this.frameIndex++
            this.cube?.drawCube()
            this.movement()
        }, 1000 / 60)
    },

    // --- CLEAR SCREEN
    clearAll() {
        this.ctx?.clearRect(0, 0, 1200, 500)
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

