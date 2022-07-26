class Bullet {

    public bulletSize: { w: number, h: number }
    public bulletVel: { x: number, y: number }

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public bulletPos: { x: number, y: number },
        public spotlightPos: { x: number, y: number },
        public cube: Cube,
        public floorBlocks: Array<Cell | Doggy>
    ) {

        this.bulletPos = { x: this.bulletPos.x, y: this.bulletPos.y }
        this.bulletSize = { w: 10, h: 10 }
        this.bulletVel = { x: 0, y: 0 }

        this.initGun()

    }

    initGun(): void {
        this.draw()
        this.update()
    }

    draw(): void {
        this.ctx!.fillStyle = 'black'
        this.ctx?.fillRect(this.bulletPos.x, this.bulletPos.y, this.bulletSize.w, this.bulletSize.h)
    }

    update(): void {

        const angle = Math.atan2(
            this.cube.cubePos.y + this.cube.cubeCenter - this.bulletPos.y,
            this.cube.cubePos.x + this.cube.cubeCenter - this.bulletPos.x
        )

        this.bulletVel.x = Math.cos(angle)
        this.bulletVel.y = Math.sin(angle)

        // this.floorBlocks.forEach(block => {

        //     // Take the platform where the cube is placed as shoot's direction of reference
        //     if (block.floorPos.x <= this.cube!.cubePos.x + 50 && block.floorPos.x >= this.cube!.cubePos.x - 50) {

        //         const angle = Math.atan2(
        //             block.floorPos.y - this.bulletPos.y,
        //             block.floorPos.x - this.bulletPos.x
        //         )

        //         this.bulletVel.x = Math.cos(angle)
        //         this.bulletVel.y = Math.sin(angle)
        //     }
        // })

    }

    move(): void {
        this.bulletPos.x += this.bulletVel.x * 10
        this.bulletPos.y += this.bulletVel.y * 10
    }

}