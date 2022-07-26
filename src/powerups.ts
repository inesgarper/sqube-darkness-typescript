class PowerUp {

    public powerUpPos: { x: number, y: number }
    public powerUpSize: { w: number, h: number }
    public isAvailable: boolean
    public isActive: boolean

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {

        this.powerUpPos = { x: this.posX, y: this.posY }
        this.powerUpSize = { w: 50, h: 100 }
        this.isAvailable = true
        this.isActive = false

        this.initPowerups()

    }

    initPowerups(): void {
        this.draw()
    }

    draw(): void {
        if (this.isAvailable) {
            this.ctx!.fillStyle = 'white'

        } else {
            this.ctx!.fillStyle = 'red'

        }
        this.ctx?.fillRect(this.powerUpPos.x, this.powerUpPos.y, this.powerUpSize.w, this.powerUpSize.h)
    }
}

class InvisibleCube extends PowerUp {
    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
    }
}

class TurnOffLights extends PowerUp {
    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
    }
}