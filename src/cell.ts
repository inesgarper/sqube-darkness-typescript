class Cell {

    public floorPos
    // public floorSize
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
    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
    }

    drawBlock(): void {
        this.ctx!.fillStyle = '#8f9ed0'
        this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height)
    }
}

class BrokenPlatform extends Cell {
    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
    }

    drawBlock(): void {
        this.ctx!.fillStyle = '#f3e600'
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