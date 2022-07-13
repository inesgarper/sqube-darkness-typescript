interface gameTemplate {
    authors: string,

    canvas: HTMLCanvasElement
    ctx: null | CanvasRenderingContext2D,

    frameIndex: undefined | number,

    cube: undefined | Cube,

    init(): void
    setContext(): void
    createCube(): void

}

const squbeDarkness: gameTemplate = {
    authors: 'Guillermo Ávila & Inés García',

    canvas: document.querySelector('#myCanvas') as HTMLCanvasElement,
    ctx: null,

    frameIndex: undefined,

    cube: undefined,

    init() {
        this.setContext()
        this.createCube()
    },

    setContext() {
        this.ctx = this.canvas.getContext('2d')
        console.log(this.ctx)
    },

    createCube() {
        this.cube = new Cube(this.ctx, 40, 60)
    },
}

