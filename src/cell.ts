class Cell {

    public floorPos
    public width: number
    public height: number

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        this.ctx = ctx
        this.floorPos = { x: posX, y: posY }
        this.width = 50
        this.height = 50

        this.initFloor()
    }

    initFloor(): void {
        // this.drawBlock(framesCounter: number)
    }

    drawBlock(framesCounter: number): void {


        this.ctx!.fillStyle = 'black'
        this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height)
    }
}

class FloorBlock extends Cell {
    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
    }
}


// Obstacles 

class BubbleHole extends Cell {
    private imageInstance: any
    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
        this.imageInstance = new Image()
        this.imageInstance.src = './images/bubble-hole/bubblehole.png'
        this.imageInstance.frames = 13
        this.imageInstance.framesIndex = Math.floor(Math.random() * 12)
    }

    drawBlock(framesCounter: number): void {
        // this.ctx!.fillStyle = 'purple'
        // this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height)

        this.ctx!.drawImage(
            this.imageInstance,
            this.imageInstance.framesIndex * (this.imageInstance.width / this.imageInstance.frames),
            0,
            this.imageInstance.width / this.imageInstance.frames,
            this.imageInstance.height,
            this.floorPos.x,
            this.floorPos.y,
            this.width,
            this.height
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

    drawBlock(framesCounter: number): void {
        // this.ctx!.fillStyle = '#334295'
        // this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height)

        this.ctx!.drawImage(this.imageInstance, this.floorPos.x, this.floorPos.y, this.width, this.height)

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

    drawBlock(framesCounter: number): void {
        // this.ctx!.fillStyle = '#8f9ed0'
        // this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height)
        this.ctx!.drawImage(this.imageInstance, this.floorPos.x, this.floorPos.y, this.width, this.height)

    }

    moveUp(): void {
        this.spikeVel = -8
        this.floorPos.y += this.spikeVel
        this.movedDistance += this.spikeVel
    }

    moveDown(): void {
        this.spikeVel = +8
        this.floorPos.y += this.spikeVel
        this.movedDistance += this.spikeVel
    }

    move(): void {
        // console.log('la distancia --->', this.movedDistance)
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

class BrokenPlatform extends FloorBlock {

    public brokenPlatformVel
    public brokenPlatformPhysics
    public isBroken: boolean
    private isDoneBreaking: boolean
    private imageInstance: any

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
    }


    drawBlock(framesCounter: number): void {
        // this.ctx!.fillStyle = '#f3e600'
        // this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width + 50, this.height)
        this.ctx!.drawImage(
            this.imageInstance,
            this.imageInstance.framesIndex * (this.imageInstance.width / this.imageInstance.frames),
            0,
            this.imageInstance.width / this.imageInstance.frames,
            this.imageInstance.height,
            this.floorPos.x,
            this.floorPos.y,
            this.width + 50,
            this.height
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
        setTimeout(() => {
            this.brokenPlatformVel.y += this.brokenPlatformPhysics.gravity
            this.floorPos.y += this.brokenPlatformVel.y
            this.isDoneBreaking = true
        }, 400)
    }
}

class DoggyPlatform extends Cell {
    public isActive: boolean
    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
        this.isActive = false
    }

    drawBlock(framesCounter: number): void {
        this.isActive ? this.ctx!.fillStyle = '#ffffff' : this.ctx!.fillStyle = '#ff330b'
        this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height)
    }
}

// HASTA AQUÍ PUEDES BORRAR QUERIDO