class Cube {

    public cubePos
    public cubeSize
    public cubeVel
    public cubePhysics
    public isOnSurface: boolean
    public isHidding: boolean

    constructor(
        private ctx: CanvasRenderingContext2D | null,
        private posX: number,
        private posY: number,
    ) {

        this.ctx = ctx
        this.cubePos = { x: posX, y: posY }
        this.cubeSize = { w: 50, h: 50 }

        this.cubeVel = { x: 0, y: 0 }
        this.cubePhysics = { gravity: 0.5 }

        this.isOnSurface = false
        this.isHidding = false

        this.initCube()
    }

    initCube(): void {
        this.drawCube()
    }

    drawCube(): void {
        this.ctx!.fillStyle = 'black'
        this.ctx?.fillRect(this.cubePos.x, this.cubePos.y, this.cubeSize.w, this.cubeSize.h)

        this.gravity()
    }

    moveRight(): void {
        this.cubePos.x += 8
    }

    moveLeft(): void {
        this.cubePos.x -= 8
    }

    gravity(): void {
        this.cubeVel.y += this.cubePhysics.gravity
        this.cubePos.y += this.cubeVel.y
    }

    jump(): void {
        this.cubeVel.y = -13
    }
}