class Cube {

    public cubePos
    public cubeSize
    public cubeVel
    public cubePhysics
    public isOnSurface: boolean
    public isHiddingLeft: boolean
    public isHiddingRight: boolean
    public isActive: boolean
    private isJumping: boolean

    // Controls
    public upKey: boolean | undefined
    public downKey: boolean | undefined
    public leftKey: boolean | undefined
    public rightKey: boolean | undefined

    constructor(

        private ctx: CanvasRenderingContext2D | null,
        private posX: number,
        private posY: number,
        private floorBlocks: Array<Cell>

    ) {

        this.ctx = ctx
        this.cubePos = { x: posX, y: posY }
        this.cubeSize = { w: 50, h: 50 }

        this.cubeVel = { x: 0, y: 0, maxVelX: 5, maxVelY: 20 }
        this.cubePhysics = { gravity: 0.5, friction: 0.6 }

        this.isOnSurface = false
        this.isHiddingLeft = false
        this.isHiddingRight = false
        this.isJumping = false
        this.isActive = true

        this.downKey = undefined
        this.leftKey = undefined
        this.rightKey = undefined

        this.initCube()
    }

    initCube(): void {
        this.draw()
    }

    draw(): void {
        this.ctx!.fillStyle = 'green'
        this.ctx?.fillRect(this.cubePos.x, this.cubePos.y, this.cubeSize.w, this.cubeSize.h)

        this.gravity()
    }

    movement(): void {
        if (this.isActive) {

            // Horizontal movement
            if (!this.leftKey && !this.rightKey || this.leftKey && this.rightKey) {
                this.slowDown()
            } else if (this.rightKey) {
                this.moveRight()
            } else if (this.leftKey) {
                this.moveLeft()
            } else {
                this.stop()
            }

            // Apply gravity
            this.gravity()

            // Correct speed
            this.regulateSpeed()

            // Define movement area
            this.checkFloorAndWallCollision()

            if (this.cubePos.x < 450 /* && this.cubePos.x > 50 */) {
                this.cubePos.x += this.cubeVel.x
                this.cubePos.y += this.cubeVel.y
            } else {
                this.scrollPlatforms()
            }

        }
    }

    regulateSpeed(): void {
        if (this.cubeVel.x > this.cubeVel.maxVelX) {
            this.cubeVel.x = this.cubeVel.maxVelX
        } else if (this.cubeVel.x < -this.cubeVel.maxVelX) {
            this.cubeVel.x = -this.cubeVel.maxVelX
        }

        if (this.cubeVel.y > this.cubeVel.maxVelY) {
            this.cubeVel.y = this.cubeVel.maxVelY
        } else if (this.cubeVel.y < -this.cubeVel.maxVelY) {
            this.cubeVel.y = -this.cubeVel.maxVelY
        }

        if (this.cubeVel.x > 0) {
            this.cubeVel.x = Math.floor(this.cubeVel.x)
        } else {
            this.cubeVel.x = Math.ceil(this.cubeVel.x)
        }

        if (this.cubeVel.y > 0) {
            this.cubeVel.y = Math.floor(this.cubeVel.y)
        } else {
            this.cubeVel.y = Math.ceil(this.cubeVel.y)
        }
    }

    moveRight(): void {
        this.cubeVel.x++
    }

    moveLeft(): void {
        this.cubeVel.x--
    }

    stop(): void {
        this.cubeVel.x = 0
    }

    slowDown(): void {
        this.cubeVel.x *= this.cubePhysics.friction
    }

    scrollPlatforms(): void {
        this.floorBlocks.forEach(block => block.floorPos.x += -this.cubeVel.x)
        this.floorBlocks.forEach(block => block.floorPos.y += -this.cubeVel.y)
    }

    gravity(): void {
        this.cubeVel.y += this.cubePhysics.gravity
    }

    jump(): void {
        if (!this.isJumping) {
            this.isJumping = true
            this.cubeVel.y -= this.cubeVel.maxVelY
        }
    }

    checkFloorAndWallCollision(): void {

        // Collision Cube Rects
        let horizontalRect = {
            x: this.cubePos.x + this.cubeVel.x,
            y: this.cubePos.y,
            width: this.cubeSize.w,
            height: this.cubeSize.h
        }

        let verticalRect = {
            x: this.cubePos.x,
            y: this.cubePos.y + this.cubeVel.y,
            width: this.cubeSize.w,
            height: this.cubeSize.h
        }

        this.floorBlocks.forEach((block, i) => {

            // Collision Block Rect
            let blockRect = {
                x: block.floorPos.x,
                y: block.floorPos.y,
                width: block.width,
                height: block.height,
            }

            // Check collisions
            if (block instanceof FloorBlock) {

                if (this.checkRectCollision(horizontalRect, blockRect)) {
                    while (this.checkRectCollision(horizontalRect, blockRect)) {
                        horizontalRect.x -= Math.sign(this.cubeVel.x)
                        if (Math.sign(this.cubeVel.x) === -1) {
                            console.log('COLISIONO HACIA LA IZQUIERDA')
                            this.isHiddingLeft = true
                        } else if (Math.sign(this.cubeVel.x) === 1) {
                            console.log('COLISIONO HACIA LA DERECHA')
                            this.isHiddingRight = true
                        }
                    }
                    this.isHiddingRight = false
                    this.isHiddingLeft = false
                    this.cubePos.x = horizontalRect.x
                    this.cubeVel.x = 0

                }

                if (this.checkRectCollision(verticalRect, blockRect)) {
                    while (this.checkRectCollision(verticalRect, blockRect)) {
                        verticalRect.y -= Math.sign(this.cubeVel.y)
                    }
                    this.cubePos.y = horizontalRect.y
                    this.isJumping = false
                    this.cubeVel.y = 0

                    if (block instanceof DoggyPlatform) block.isActive = true
                    if (block instanceof BrokenPlatform) block.isBroken = true
                }

            }

            // if (block instanceof BrokenPlatform) {
            //     if (this.checkRectCollision(verticalRect, blockRect)) {
            //         while (this.checkRectCollision(verticalRect, blockRect)) {
            //             verticalRect.y -= Math.sign(this.cubeVel.y)
            //         }
            //         this.cubePos.y = horizontalRect.y
            //         this.cubeVel.y = 0
            //         block.isBroken = true
            //     }
            // }

        })

    }

    checkRectCollision(r1: any, r2: any): boolean {
        if (r1.x >= r2.x + r2.width) {
            return false
        } else if (r1.x + r1.width <= r2.x) {
            return false
        } else if (r1.y >= r2.y + r2.height) {
            return false
        } else if (r1.y + r1.height <= r2.y) {
            return false
        } else {
            return true
        }
    }

}

