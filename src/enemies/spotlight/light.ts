class Light {

    public lightPos: { x: number, y: number }
    public lightSize: { w: number, h: number }
    public rotation: number

    public isOn: boolean

    public isMovingLeft: boolean | undefined
    public isMovingRight: boolean | undefined

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public spotlightPos: { x: number, y: number },
        public maxPosX: { l: number, r: number },
        public spotlightSize: { w: number, h: number },
        public spotlightCenter: number,
        public spotlightVel: { x: number, y: number },
        public initialDirection: string
    ) {

        this.lightPos = { x: this.spotlightPos.x - 300, y: this.spotlightPos.y + 180 }
        this.lightSize = { w: this.spotlightSize.w + 600, h: this.spotlightSize.h + 600 }
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

        this.ctx?.translate(this.lightPos.x + (this.lightSize.w / 2), this.lightPos.y + (this.lightSize.h / 2))
        this.ctx?.rotate(this.rotation * Math.PI / 180)
        this.ctx?.translate(-(this.lightPos.x + this.lightSize.w / 2), -(this.lightPos.y + this.lightSize.h / 2))

        const lightGradient = this.ctx!.createLinearGradient(
            this.lightPos.y + 40,
            this.lightPos.x + 40 + this.spotlightSize.w,
            this.lightSize.h + 500,
            this.lightPos.x + 40 + this.spotlightSize.w,
        );

        lightGradient.addColorStop(0, "#EAE22A");
        lightGradient.addColorStop(1, "#DFDFDF00");

        this.ctx!.fillStyle = lightGradient;
        this.ctx?.fillRect(this.lightPos.x, this.lightPos.y, this.lightSize.w, this.lightSize.h)

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
                this.lightPos.x += 2
            } else {
                this.isMovingRight = false
                this.isMovingLeft = true
                // this.rotation += 0.5
            }

        } else if (this.isMovingLeft) {

            if (this.spotlightPos.x > this.maxPosX.l) {
                this.lightPos.x -= 2
            } else {
                this.isMovingRight = true
                this.isMovingLeft = false
                // this.rotation -= 0.5
            }
        }
    }


}