class Cube {

    public cubePos
    public cubeSize
    public cubeVel
    public cubePhysics
    public isOnSurface: boolean
    public isHidding: boolean
    public isActive: boolean
    private isJumping: boolean
    public jumpArr: Array<string>

    // Controls
    public upKey: boolean | undefined
    public downKey: boolean | undefined
    public leftKey: boolean | undefined
    public rightKey: boolean | undefined

    constructor(

        private ctx: CanvasRenderingContext2D | null,
        private posX: number,
        private posY: number,
        private floorBlocks: Array<FloorBlock>

    ) {

        this.ctx = ctx
        this.cubePos = { x: posX, y: posY }
        this.cubeSize = { w: 50, h: 50 }

        this.cubeVel = { x: 0, y: 0, maxVelX: 5, maxVelY: 15 }
        this.cubePhysics = { gravity: 0.5, friction: 0.6 }

        this.jumpArr = []

        this.isOnSurface = false
        this.isHidding = false
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
            } else if (this.rightKey && this.cubePos.x < 400) {
                this.moveRight()
            } else if (this.leftKey && this.cubePos.x > 100) {
                this.moveLeft()
            } else {
                this.scrollPlatforms()
                this.stop()
            }

            // Apply gravity
            this.gravity()

            // Correct speed
            this.regulateSpeed()

            // Define movement area
            this.checkFloorAndWallCollision()

            this.cubePos.x += this.cubeVel.x
            this.cubePos.y += this.cubeVel.y
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
        if (this.rightKey) {
            this.floorBlocks.forEach(block => block.floorPos.x -= 5)
        } else if (this.leftKey) {
            this.floorBlocks.forEach(block => block.floorPos.x += 5)
        }
    }

    gravity(): void {
        this.cubeVel.y += this.cubePhysics.gravity
        // this.cubePos.y += this.cubeVel.y
    }

    jump(): void {

        if (this.isJumping === false) {
            this.isJumping = true
            this.cubeVel.y -= 15
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

        this.floorBlocks.forEach(block => {

            // Collision Block Rect
            let blockRect = {
                x: block.floorPos.x,
                y: block.floorPos.y,
                width: block.floorSize.w,
                height: block.floorSize.h,
            }

            // Check collisions
            if (this.checkRectCollision(horizontalRect, blockRect)) {
                while (this.checkRectCollision(horizontalRect, blockRect)) {
                    horizontalRect.x -= Math.sign(this.cubeVel.x)
                }
                this.cubePos.x = horizontalRect.x
                this.cubeVel.x = 0
            }

            if (this.checkRectCollision(verticalRect, blockRect)) {
                while (this.checkRectCollision(verticalRect, blockRect)) {
                    verticalRect.y -= Math.sign(this.cubeVel.y)
                }
                this.cubePos.y = horizontalRect.y
                this.jumpArr.splice(0, 1)
                this.isJumping = false
                this.cubeVel.y = 0
            }

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

