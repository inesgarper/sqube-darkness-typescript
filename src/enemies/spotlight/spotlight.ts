class Spotlight {

    public pos: Vector
    public maxPosX: MaxPosX
    private size: Size
    private center: number
    private vel: Vector

    private isMovingLeft: boolean | undefined
    private isMovingRight: boolean | undefined

    public light: Light | undefined
    public bullets: Array<Bullet>

    public imageInstance: any

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

        this.pos = { x: this.posX, y: this.posY }
        this.maxPosX = { l: this.maxPosXLeft, r: this.maxPosXRight }
        this.size = { w: 80, h: 80 }
        this.center = this.size.w / 2
        this.vel = { x: 0, y: 0 }

        this.isMovingLeft = undefined
        this.isMovingRight = undefined

        this.light = undefined
        this.bullets = []

        this.imageInstance = new Image()
        this.imageInstance.frames = 18
        this.imageInstance.framesIndex = 0
        this.imageInstance.src = './images/spotlight/spotlight.png'

        this.initSpotlight()

    }

    initSpotlight(): void {
        this.setDirection()
        this.createLight()
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
        if (framesCounter % 5 == 0) {
            this.imageInstance.framesIndex++;
        }
        if (this.imageInstance.framesIndex >= this.imageInstance.frames) {
            this.imageInstance.framesIndex = 0;
        }
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

            if (this.pos.x < this.maxPosX.r) {
                this.pos.x += 2
            } else {
                this.isMovingRight = false
                this.isMovingLeft = true
            }

        } else if (this.isMovingLeft) {

            if (this.pos.x > this.maxPosX.l) {
                this.pos.x -= 2
            } else {
                this.isMovingRight = true
                this.isMovingLeft = false
            }
        }

    }

    createLight(): void {
        this.light = new Light(this.ctx, this.pos, this.maxPosX, this.size, this.center, this.vel, this.initialDirection)
    }

    shoot(framesCounter: number): void {
        if (this.cube.isFound) {
            if (framesCounter % 70 === 0) this.createBullets()
        }
    }

    createBullets(): void {
        this.bullets.push(new Bullet(this.ctx, { x: this.pos.x + this.center, y: this.pos.y + this.center }, this.cube))
    }

    deleteCollisionedBullet(index: number): void {
        this.bullets.splice(index, 1)
    }
}