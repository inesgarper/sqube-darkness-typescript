class Spotlight {

    public spotlightPos: { x: number, y: number }
    public maxPosX: { l: number, r: number }
    public spotlightSize: { w: number, h: number }
    public spotlightCenter: number
    public spotlightVel: { x: number, y: number }

    public isMovingLeft: boolean | undefined
    public isMovingRight: boolean | undefined

    public light: Light | undefined
    public bullets: Array<Bullet>

    constructor(

        private ctx: CanvasRenderingContext2D | null,
        private posX: number,
        private posY: number,
        private maxPosXLeft: number,
        private maxPosXRight: number,
        private initialDirection: string,
        public cube: Cube,
        public floorBlocks: Array<Cell | Doggy>

    ) {

        this.spotlightPos = { x: this.posX, y: this.posY }
        this.maxPosX = { l: this.maxPosXLeft, r: this.maxPosXRight }
        this.spotlightSize = { w: 80, h: 80 }
        this.spotlightCenter = this.spotlightSize.w / 2
        this.spotlightVel = { x: 0, y: 0 }

        this.isMovingLeft = undefined
        this.isMovingRight = undefined

        this.light = undefined
        this.bullets = []

        this.initSpotlight()

    }

    initSpotlight(): void {
        this.draw()
        this.setDirection()
        this.createLight()
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
                this.spotlightPos.x += 2
            } else {
                this.isMovingRight = false
                this.isMovingLeft = true
            }

        } else if (this.isMovingLeft) {

            if (this.spotlightPos.x > this.maxPosX.l) {
                this.spotlightPos.x -= 2
            } else {
                this.isMovingRight = true
                this.isMovingLeft = false
            }
        }

    }

    createLight(): void {
        this.light = new Light(this.ctx, this.spotlightPos, this.maxPosX, this.spotlightSize, this.spotlightCenter, this.spotlightVel, this.initialDirection)
    }

    shoot(): void {
        this.bullets.push(new Bullet(this.ctx, { x: this.spotlightPos.x + this.spotlightCenter, y: this.spotlightPos.y + this.spotlightCenter }, this.spotlightPos, this.cube, this.floorBlocks))
    }

    deleteCollisionedBullet(index: number): void {
        this.bullets.splice(index, 1)
    }
}