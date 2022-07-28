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

    private imageInstance: any

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

        this.imageInstance = new Image()
        this.imageInstance.frames = 9
        this.imageInstance.framesIndex = 0
        this.imageInstance.src = './images/doggy/doggy-sprite.png'

        // this.initFloor()
    }

    // initFloor(): void {
    // console.log('POSICION INICIAL ----->', this.floorPos.x)
    // this.drawBlock()
    // }

    drawBlock(framesCounter: number): void {

        this.ctx!.drawImage(
            this.imageInstance,
            this.imageInstance.framesIndex * (this.imageInstance.width / this.imageInstance.frames),
            0,
            this.imageInstance.width / this.imageInstance.frames,
            this.imageInstance.height,
            this.floorPos.x,
            this.floorPos.y,
            this.width,
            this.height
        )

        this.animate(framesCounter)

        this.move()
    }

    animate(framesCounter: number): void {
        if (framesCounter % 5 == 0) {
            this.imageInstance.framesIndex++;
        }
        if (this.imageInstance.framesIndex >= this.imageInstance.frames) {
            this.imageInstance.framesIndex = 0;
        }
    }

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