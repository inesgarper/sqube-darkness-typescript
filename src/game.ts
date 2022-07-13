interface gameTemplate {
    authors: string,

    canvas: HTMLCanvasElement
    ctx: null | CanvasRenderingContext2D,

    frameIndex: number,

    cube: undefined | Cube,

    keyPressed: Array<string>

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

    init() {
        this.setContext()
        this.createCube()
        this.setEventHandlers()
        this.drawAll()
    },

    setContext() {
        this.ctx = this.canvas.getContext('2d')
        console.log(this.ctx)
    },

    createCube() {
        this.cube = new Cube(this.ctx, 40, 60)
    },

    drawAll() {
        let intervalId = setInterval(() => {
            this.frameIndex++,
                this.clearAll(),
                this.cube?.drawCube()
        }, 1000 / 60)
    },

    setEventHandlers() {
        document.addEventListener('keydown', event => {
            const { key } = event

            if (key === 'ArrowRight') this.cube?.moveRight()
        })
    },

    clearAll() {
        this.ctx?.clearRect(0, 0, 1200, 500)
    }
}

