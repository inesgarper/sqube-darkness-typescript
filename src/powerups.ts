class PowerUp {

    public powerUpPos: Vector
    public powerUpSize: Size
    public isAvailable: boolean
    public isActive: boolean

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {

        this.powerUpPos = { x: this.posX, y: this.posY }
        this.powerUpSize = { w: 80, h: 80 }
        this.isAvailable = true
        this.isActive = false
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
    public imageInstance: any
    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
        this.imageInstance = new Image()
        this.imageInstance.src = './images/power-ups/invisible-cube.png'
    }

    draw(): void {
        this.isAvailable ? this.ctx!.globalAlpha = 1 : this.ctx!.globalAlpha = 0.15
        this.ctx!.drawImage(this.imageInstance, this.powerUpPos.x, this.powerUpPos.y, this.powerUpSize.w, this.powerUpSize.h)
        this.ctx!.globalAlpha = 1
    }
}

class TurnOffLights extends PowerUp {
    public imageInstance: any
    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        super(ctx, posX, posY)
        this.imageInstance = new Image()
        this.imageInstance.src = './images/power-ups/lights-off.png'
    }

    draw(): void {
        this.isAvailable ? this.ctx!.globalAlpha = 1 : this.ctx!.globalAlpha = 0.15
        this.ctx!.drawImage(this.imageInstance, this.powerUpPos.x, this.powerUpPos.y, this.powerUpSize.w, this.powerUpSize.h)
        this.ctx!.globalAlpha = 1
    }
}