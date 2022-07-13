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

        this.cubeVel = { x: 1, y: 0.5 }
        this.cubePhysics = { gravity: 0.1 }


        this.initCube()
    }

    initCube(): void {
        this.drawCube()
    }

    drawCube(): void {
        // console.log('ME DIBUJO')
        this.ctx!.fillStyle = 'black'
        this.ctx?.fillRect(this.cubePos.x, this.cubePos.y, 50, 50)
    }

    moveRight(): void {
        console.log('ME MUEVO A LA DERECHA')
        this.cubePos.x += 8
    }

}