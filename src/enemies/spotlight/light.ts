class Light {

    public pos: Vector
    public size: Size
    public rotation: number

    public isOn: boolean

    public isMovingLeft: boolean | undefined
    public isMovingRight: boolean | undefined

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public spotlightPos: Vector,
        public maxPosX: MaxPosX,
        public spotlightSize: Size,
        public spotlightCenter: number,
        public initialDirection: string
    ) {

        this.pos = { x: this.spotlightPos.x - 300, y: this.spotlightPos.y + 180 }
        this.size = { w: this.spotlightSize.w + 600, h: this.spotlightSize.h + 600 }
        this.rotation = 45

        this.isOn = true

        this.isMovingLeft = undefined
        this.isMovingRight = undefined

        this.initLight()
    }

    initLight(): void {
        this.draw()
        this.setDirection()
    }

    draw(): void {

        this.ctx?.save()

        this.ctx?.translate(this.pos.x + (this.size.w / 2), this.pos.y + (this.size.h / 2))
        this.ctx?.rotate(this.rotation * Math.PI / 180)
        this.ctx?.translate(-(this.pos.x + this.size.w / 2), -(this.pos.y + this.size.h / 2))

        const lightGradient = this.ctx!.createLinearGradient(0, 0, 1800, 1800)
        lightGradient.addColorStop(0, 'rgba(255,255,255,0.7)')
        lightGradient.addColorStop(0.2, 'rgba(255,255,255,0.5)');
        lightGradient.addColorStop(0.4, 'rgba(255,255,255,0.1)')
        lightGradient.addColorStop(0.9, 'rgba(255,255,255,0)')

        this.ctx!.fillStyle = lightGradient;
        this.ctx?.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)

        this.ctx?.restore()
    }

    setDirection(): void {
        if (this.initialDirection === 'left') {
            this.isMovingLeft = true
            this.isMovingRight = false
        } else if (this.initialDirection === 'right') {
            this.isMovingRight = true
            this.isMovingLeft = false
        }
    }

    move(): void {
        if (this.isMovingRight) {

            if (this.spotlightPos.x < this.maxPosX.r) {
                this.pos.x += 2
            } else {
                this.isMovingRight = false
                this.isMovingLeft = true
            }

        } else if (this.isMovingLeft) {

            if (this.spotlightPos.x > this.maxPosX.l) {
                this.pos.x -= 2
            } else {
                this.isMovingRight = true
                this.isMovingLeft = false
            }
        }
    }


}