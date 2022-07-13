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
        this.drawAll()
    },

    setContext() {
        this.ctx = this.canvas.getContext('2d')
    },

    createCube() {
        this.cube = new Cube(this.ctx, 40, 60)
    },

    drawAll() {
        this.intervalId = setInterval(() => {
            this.clearAll()
            this.frameIndex++
            this.cube?.drawCube()
        }, 1000 / 60)
    },

    setEventHandlers() {
        document.addEventListener('keydown', event => {
            const { key } = event

            if (key === 'ArrowRight') this.cube?.moveRight()
            if (key === 'ArrowUp') this.cube?.jump()
        })
    },

    clearAll() {
        this.ctx?.clearRect(0, 0, 1200, 500)
    }
}

