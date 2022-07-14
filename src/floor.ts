class FloorBlock {

    public floorPos
    public floorSize

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
        this.drawBlock()
    }

    drawBlock(): void {
        this.ctx!.fillStyle = 'black'
        this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.floorSize.w, this.floorSize.h)
    }
}