class Cell {

    public pos: { x: number, y: number }
    public size: { w: number, h: number }

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        this.ctx = ctx
        this.pos = { x: this.posX, y: this.posY }
        this.size = { w: 50, h: 50 }
    }

}

class MapBlock extends Cell {

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
    }

    draw(): void {
        this.ctx!.fillStyle = 'black'
        this.ctx?.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)
    }
}


// Obstacles 

class BubbleHole extends Cell {

    private imageInstance: any
    public initialPos: { x: number, y: number }
    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
        this.initialPos = { x: posX, y: posY }
        this.imageInstance = new Image()
        this.imageInstance.src = './images/bubble-hole/bubblehole.png'
        this.imageInstance.frames = 13
        this.imageInstance.framesIndex = Math.floor(Math.random() * 12)
    }

    draw(framesCounter: number): void {

        this.ctx!.drawImage(
            this.imageInstance,
            this.imageInstance.framesIndex * (this.imageInstance.width / this.imageInstance.frames),
            0,
            this.imageInstance.width / this.imageInstance.frames,
            this.imageInstance.height,
            this.pos.x,
            this.pos.y,
            this.size.w,
            this.size.h
        )

        this.animate(framesCounter)
    }

    animate(framesCounter: number): void {
        if (framesCounter % 6 == 0) {
            this.imageInstance.framesIndex++;
        }
        if (this.imageInstance.framesIndex > 12) {
            this.imageInstance.framesIndex = 0;
        }
    }

}


class Spike extends Cell {

    public imageInstance: any

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
        this.imageInstance = new Image()
        this.imageInstance.src = './images/spikes/spikes.png'
    }

    draw(): void {
        this.ctx!.drawImage(this.imageInstance, this.pos.x, this.pos.y, this.size.w, this.size.h)
    }
}

class TempSpike extends Spike {

    private spikeVel: number
    public movedDistance: number
    private onTop: boolean
    private onBottom: boolean

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number
    ) {
        super(ctx, posX, posY)
        this.spikeVel = 0
        this.movedDistance = 0
        this.onTop = true
        this.onBottom = false
    }

    draw(): void {
        this.ctx!.drawImage(this.imageInstance, this.pos.x, this.pos.y, this.size.w, this.size.h)
    }

    moveUp(): void {
        this.spikeVel = -8
        this.pos.y += this.spikeVel
        this.movedDistance += this.spikeVel
    }

    moveDown(): void {
        this.spikeVel = +8
        this.pos.y += this.spikeVel
        this.movedDistance += this.spikeVel
    }

    move(): void {

        if (this.movedDistance >= 50) {
            this.onTop = false
            setTimeout(() => {
                this.onBottom = true
            }, 1000)
        } else if (this.movedDistance === 0) {
            this.onBottom = false
            setTimeout(() => {
                this.onTop = true
            }, 1000)
        }

        if (this.onTop) this.moveDown()
        else if (this.onBottom) this.moveUp()
    }
}

class BrokenPlatform extends MapBlock {

    public brokenPlatformVel
    public brokenPlatformPhysics
    public isBroken: boolean
    private isDoneBreaking: boolean
    private imageInstance: any
    private breakAudio: any

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
        this.brokenPlatformVel = { x: 0, y: 0 }
        this.brokenPlatformPhysics = { gravity: 0.5 }
        this.isBroken = false
        this.isDoneBreaking = false

        this.imageInstance = new Image()
        this.imageInstance.src = './images/broken-platform/broken-platform.png'
        this.imageInstance.frames = 10
        this.imageInstance.framesIndex = 0

        this.breakAudio = new Audio('./sounds/break.wav')
        this.breakAudio.volume = 0.6
    }


    drawPlatform(framesCounter: number): void {

        this.ctx!.drawImage(
            this.imageInstance,
            this.imageInstance.framesIndex * (this.imageInstance.width / this.imageInstance.frames),
            0,
            this.imageInstance.width / this.imageInstance.frames,
            this.imageInstance.height,
            this.pos.x,
            this.pos.y,
            this.size.w + 50,
            this.size.h
        )

        if (this.isDoneBreaking) this.animate(framesCounter)
    }

    animate(framesCounter: number): void {
        if (this.isDoneBreaking) {
            if (framesCounter % 3 == 0) {
                this.imageInstance.framesIndex++;
            }
        }
    }

    break(): void {
        if (!this.isDoneBreaking) {
            setTimeout(() => {
                this.brokenPlatformVel.y += this.brokenPlatformPhysics.gravity
                this.pos.y += this.brokenPlatformVel.y
                this.isDoneBreaking = true
                this.breakAudio.play()
            }, 400)
        }
    }
}