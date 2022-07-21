class Cell {

    public floorPos
    public width: number
    public height: number

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number
    ) {
        this.ctx = ctx
        this.floorPos = { x: posX, y: posY }
        this.width = 50
        this.height = 50

        this.initFloor()
    }

    initFloor(): void {
        this.drawBlock()
    }

    drawBlock(): void {
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

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
    }

    drawBlock(): void {
        this.ctx!.fillStyle = 'purple'
        this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height)
    }
}

class Spike extends Cell {
    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
    }

    drawBlock(): void {
        this.ctx!.fillStyle = '#334295'
        this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height)
    }
}

class TempSpike extends Spike {
    public prueba: string
    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
        this.prueba = 'hola'
    }

    drawBlock(): void {
        this.ctx!.fillStyle = '#8f9ed0'
        this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height)
    }

    moveUp(): void {
        this.floorPos.y++
    }

    moveDown(): void {
        this.floorPos.y--
    }
}

class BrokenPlatform extends FloorBlock {

    public brokenPlatformVel
    public brokenPlatformPhysics
    public isBroken: boolean

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
        this.brokenPlatformVel = { x: 0, y: 0 }
        this.brokenPlatformPhysics = { gravity: 0.5 }
        this.isBroken = false
    }


    drawBlock(): void {
        this.ctx!.fillStyle = '#f3e600'
        this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width + 50, this.height)
    }

    break(): void {
        setTimeout(() => {
            this.brokenPlatformVel.y += this.brokenPlatformPhysics.gravity
            this.floorPos.y += this.brokenPlatformVel.y
        }, 400)
    }
}

class DoggyPlatform extends FloorBlock {
    public isActive: boolean
    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
        this.isActive = false
    }

    drawBlock(): void {
        this.isActive ? this.ctx!.fillStyle = '#ffffff' : this.ctx!.fillStyle = '#ff330b'
        this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height)
    }
}

// ELIMINAR Y METER EN ENEMIGOS
class Doggy extends Cell {
    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
    }

    drawBlock(): void {
        this.ctx!.fillStyle = '#75b835'
        this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height)
    }
}