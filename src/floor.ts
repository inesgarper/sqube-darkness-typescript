class FloorBlock {

    private floorPos
    private floorSize

    constructor(
        private ctx: CanvasRenderingContext2D | null,
        private posX: number,
        private posY: number,
        private width: number,
        private height: number
    ) {
        this.ctx = ctx
        this.floorPos = { x: posX, y: posY }
        this.floorSize = { w: width, h: height }

        this.initFloor()
    }

    initFloor(): void {
        this.drawFloor()
    }

    drawFloor(): void {
        console.log('dibujando')
        this.ctx!.fillStyle = 'black'
        this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.floorSize.w, this.floorSize.h)
    }
}