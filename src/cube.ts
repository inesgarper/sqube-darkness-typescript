class Cube {

    private cubePos
    // private cubeSize
    private cubeVel
    private cubePhysics

    constructor(
        private ctx: CanvasRenderingContext2D | null,
        private posX: number,
        private posY: number,
    ) {

        this.ctx = ctx
        this.cubePos = { x: posX, y: posY }
        // this.cubeSize = { w: 60, h: 60 }

        this.cubeVel = { x: 0, y: 0 }
        this.cubePhysics = { gravity: 0.3 }

        this.initCube()
    }

    initCube(): void {
        this.drawCube()
    }

    drawCube(): void {
        this.ctx!.fillStyle = 'black'
        this.ctx?.fillRect(this.cubePos.x, this.cubePos.y, 50, 50)

        this.gravity()
    }

    moveRight(): void {
        this.cubePos.x += 8
        console.log(this.cubePos.x)
    }

    gravity(): void {
        this.cubeVel.y += this.cubePhysics.gravity
        this.cubePos.y += this.cubeVel.y
    }

    jump(): void {
        this.cubeVel.y = -13
    }
}