class Spotlight {

    public spotlightPos
    public maxPosX
    public spotlightSize
    public spotlightCenter: number
    public spotlightVel

    public playerFound: boolean
    public isMovingLeft: boolean | undefined
    public isMovingRight: boolean | undefined

    constructor(

        private ctx: CanvasRenderingContext2D | null,
        private posX: number,
        private posY: number,
        private maxPosXLeft: number,
        private maxPosXRight: number,
        private initialDirection: string

    ) {

        this.spotlightPos = { x: this.posX, y: this.posY }
        this.maxPosX = { l: this.maxPosXLeft, r: this.maxPosXRight }
        this.spotlightSize = { w: 70, h: 70 }
        this.spotlightCenter = this.spotlightSize.w / 2
        this.spotlightVel = { x: 0, y: 0 }

        this.playerFound = false
        this.isMovingLeft = undefined
        this.isMovingRight = undefined


        this.initSpotlight()

    }

    initSpotlight(): void {
        this.draw()
        this.setDirection()
    }

    draw(): void {
        this.ctx!.fillStyle = 'white'
        this.ctx?.fillRect(this.spotlightPos.x, this.spotlightPos.y, this.spotlightSize.w, this.spotlightSize.h)
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
                this.spotlightPos.x++
            } else {
                this.isMovingRight = false
                this.isMovingLeft = true
            }

        } else if (this.isMovingLeft) {

            if (this.spotlightPos.x > this.maxPosX.l) {
                this.spotlightPos.x--
            } else {
                this.isMovingRight = true
                this.isMovingLeft = false
            }
        }

    }
}