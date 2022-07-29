class Bullet {

    public size: Size
    private vel: Vector

    constructor(
        private ctx: CanvasRenderingContext2D | null,
        public pos: Vector,
        private cube: Cube,
    ) {

        this.pos = { x: this.pos.x, y: this.pos.y }
        this.size = { w: 10, h: 10 }
        this.vel = { x: 0, y: 0 }

        this.initGun()
    }

    initGun(): void {
        this.draw()
        this.updateDirection()
    }

    draw(): void {
        this.ctx!.fillStyle = 'black'
        this.ctx?.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h)
    }

    updateDirection(): void {
        const angle = Math.atan2(
            this.cube.pos.y + this.cube.center - this.pos.y,
            this.cube.pos.x + this.cube.center - this.pos.x
        )

        this.vel.x = Math.cos(angle)
        this.vel.y = Math.sin(angle)
    }

    move(): void {
        this.pos.x += this.vel.x * 15
        this.pos.y += this.vel.y * 15
    }

}