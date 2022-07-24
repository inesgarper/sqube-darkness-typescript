class Doggy {

    public initialPos
    public floorPos
    private doggyVel: number
    // private doggyPhysics
    public range
    public width: number
    public height: number
    public isActive: boolean
    public canMove: boolean
    public movedDistance: number
    public touchedLeft: boolean
    public touchedRight: boolean

    constructor(
        public ctx: CanvasRenderingContext2D | null,
        public posX: number,
        public posY: number,
    ) {
        this.ctx = ctx
        this.initialPos = { x: posX, y: posY }
        this.floorPos = { x: posX, y: posY }
        this.doggyVel = 0
        // this.doggyPhysics = { acceleration: 1, friction: 0.2 }
        this.range = { minX: (posX - 350), maxX: posX }
        this.width = 50
        this.height = 50
        this.isActive = true
        this.canMove = false
        this.movedDistance = 0
        this.touchedLeft = false
        this.touchedRight = true


        this.initFloor()
    }

    initFloor(): void {
        console.log('POSICION INICIAL ----->', this.floorPos.x)
        this.drawBlock()
    }

    drawBlock(): void {
        this.isActive ? this.ctx!.fillStyle = '#75b835' : this.ctx!.fillStyle = '#253a0f'
        this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height)

        this.move()
    }

    // move(direction: number): void {
    //     if (this.doggyVel < 3) {
    //         this.doggyVel += this.doggyPhysics.acceleration
    //         this.floorPos.x -= direction * this.doggyVel
    //     } else {
    //         this.floorPos.x -= direction * 3
    //     }
    // }

    move(): void {
        if (this.canMove) {

            if (this.movedDistance >= 350) {
                this.touchedRight = false
                if (this.isActive) this.touchedLeft = true
                else if (!this.isActive) {
                    setTimeout(() => {
                        this.touchedLeft = true
                    }, 1500)
                }
            } else if (this.movedDistance === 0) {
                this.touchedLeft = false
                this.touchedRight = true
            }

            if (this.touchedRight) {
                this.doggyVel = 7
                this.floorPos.x -= this.doggyVel
                this.movedDistance += this.doggyVel
            } else if (this.touchedLeft) {
                this.doggyVel = -7
                this.floorPos.x -= this.doggyVel
                this.movedDistance += this.doggyVel

                if (this.movedDistance <= 0) this.canMove = false
            }
        }
    }
}

// HASTA AQUÍ PUEDES BORRAR QUERIDO