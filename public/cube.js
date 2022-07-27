"use strict";
class Cube {
    constructor(ctx, posX, posY, floorBlocks, enemies) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.floorBlocks = floorBlocks;
        this.enemies = enemies;
        this.cubePos = { x: this.posX, y: this.posY };
        this.cubeSize = { w: 50, h: 50 };
        this.cubeCenter = this.cubeSize.w / 2;
        this.cubeVel = { x: 0, y: 0, maxVelX: 5, maxVelY: 20 };
        this.cubePhysics = { gravity: 0.5, friction: 0.6 };
        this.isHidding = false;
        this.isFound = false;
        this.isJumping = false;
        this.isInvisible = false;
        this.isFacingRight = true;
        this.isFacingLeft = false;
        this.canSpinRight = false;
        this.canSpinLeft = false;
        this.leftKey = undefined;
        this.rightKey = undefined;
        this.imageInstanceJumpingRight = new Image();
        this.imageInstanceJumpingRight.src = './images/cube/cube-right.png';
        this.imageInstanceJumpingRight.frames = 9;
        this.imageInstanceJumpingRight.framesIndex = 0;
        this.imageInstanceRight = new Image();
        this.imageInstanceRight.src = './images/cube/right.png';
        this.imageInstanceJumpingLeft = new Image();
        this.imageInstanceJumpingLeft.src = './images/cube/cube-left.png';
        this.imageInstanceJumpingLeft.frames = 9;
        this.imageInstanceJumpingLeft.framesIndex = 0;
        this.imageInstanceLeft = new Image();
        this.imageInstanceLeft.src = './images/cube/left.png';
        this.imageInstanceHidden = new Image();
        this.imageInstanceHidden.src = './images/cube/hidden.png';
        this.imageSrc;
    }
    draw() {
        // if (this.isHidding) {
        //     this.ctx!.fillStyle = 'black'
        // } else if (this.isFound) {
        //     this.ctx!.fillStyle = 'red'
        // } else if (this.isInvisible) {
        //     this.ctx!.fillStyle = 'rgba(0, 0, 0, 0.1)'
        // } else {
        //     this.ctx!.fillStyle = 'green'
        // }
        if (this.isFacingRight)
            this.imageSrc = this.imageInstanceRight;
        if (this.isFacingLeft)
            this.imageSrc = this.imageInstanceLeft;
        if (this.isJumping || this.isJumping && this.isFacingRight)
            this.imageSrc = this.imageInstanceJumpingRight;
        if (this.isJumping || this.isJumping && this.isFacingLeft)
            this.imageSrc = this.imageInstanceJumpingLeft;
        if (this.isHidding)
            this.imageSrc = this.imageInstanceHidden;
        // if (this.isJumping) {
        //     this.cubeSize.w = 50
        //     this.cubeSize.h = 50
        // }
        this.isInvisible ? this.ctx.globalAlpha = 0.1 : this.ctx.globalAlpha = 1;
        if (this.imageSrc === this.imageInstanceHidden || this.imageSrc === this.imageInstanceLeft || this.imageSrc === this.imageInstanceRight) {
            this.cubeSize.w = 50;
            this.cubeSize.h = 50;
            this.ctx.drawImage(this.imageSrc, this.cubePos.x, this.cubePos.y, this.cubeSize.w, this.cubeSize.h);
        }
        else {
            this.ctx.drawImage(this.imageSrc, this.imageSrc.framesIndex * (this.imageSrc.width / this.imageSrc.frames), 0, this.imageSrc.width / this.imageSrc.frames, this.imageSrc.height, this.cubePos.x, this.cubePos.y, this.cubeSize.w, this.cubeSize.h);
        }
        this.ctx.globalAlpha = 1;
        this.gravity();
    }
    spinRight(framesCounter) {
        if (this.canSpinRight) {
            this.cubeSize.w = 70.79;
            this.cubeSize.h = 70.79;
            if (framesCounter % 2 == 0) {
                this.imageSrc.framesIndex--;
            }
            if (this.imageSrc.framesIndex < 0) {
                this.imageSrc.framesIndex = 8;
            }
            if (this.imageSrc.framesIndex === 0) {
                this.canSpinRight = false;
            }
            this.cubeSize.w = 50;
            this.cubeSize.h = 50;
        }
    }
    spinLeft(framesCounter) {
        if (this.canSpinLeft) {
            this.cubeSize.w = 70.79;
            this.cubeSize.h = 70.79;
            if (framesCounter % 2 == 0) {
                this.imageSrc.framesIndex++;
            }
            if (this.imageSrc.framesIndex > 8) {
                this.imageSrc.framesIndex = 0;
            }
            if (this.imageSrc.framesIndex === 0) {
                this.canSpinLeft = false;
            }
            this.cubeSize.w = 50;
            this.cubeSize.h = 50;
        }
    }
    movement() {
        // Horizontal movement
        if (!this.leftKey && !this.rightKey || this.leftKey && this.rightKey) {
            this.slowDown();
        }
        else if (this.rightKey) {
            this.moveRight();
        }
        else if (this.leftKey) {
            this.moveLeft();
        }
        else {
            this.stop();
        }
        // Apply gravity
        this.gravity();
        // Correct speed
        this.regulateSpeed();
        // Define movement area
        this.checkFloorAndWallCollision();
        if (this.cubePos.x < 450 /* && this.cubePos.x > 50 */) {
            this.cubePos.x += this.cubeVel.x;
            this.cubePos.y += this.cubeVel.y;
        }
        else {
            this.scrollPlatforms();
            this.scrollEnemies();
        }
    }
    regulateSpeed() {
        if (this.cubeVel.x > this.cubeVel.maxVelX) {
            this.cubeVel.x = this.cubeVel.maxVelX;
        }
        else if (this.cubeVel.x < -this.cubeVel.maxVelX) {
            this.cubeVel.x = -this.cubeVel.maxVelX;
        }
        if (this.cubeVel.y > this.cubeVel.maxVelY) {
            this.cubeVel.y = this.cubeVel.maxVelY;
        }
        else if (this.cubeVel.y < -this.cubeVel.maxVelY) {
            this.cubeVel.y = -this.cubeVel.maxVelY;
        }
        if (this.cubeVel.x > 0) {
            this.cubeVel.x = Math.floor(this.cubeVel.x);
        }
        else {
            this.cubeVel.x = Math.ceil(this.cubeVel.x);
        }
        if (this.cubeVel.y > 0) {
            this.cubeVel.y = Math.floor(this.cubeVel.y);
        }
        else {
            this.cubeVel.y = Math.ceil(this.cubeVel.y);
        }
    }
    moveRight() {
        this.isFacingLeft = false;
        this.isFacingRight = true;
        this.cubeVel.x++;
        this.unblockIfHidding();
        if (this.isJumping)
            this.canSpinRight = true;
    }
    moveLeft() {
        this.isFacingRight = false;
        this.isFacingLeft = true;
        this.cubeVel.x--;
        this.unblockIfHidding();
        if (this.isJumping)
            this.canSpinLeft = true;
    }
    stop() {
        this.cubeVel.x = 0;
    }
    slowDown() {
        this.cubeVel.x *= this.cubePhysics.friction;
    }
    scrollPlatforms() {
        this.floorBlocks.forEach(block => {
            block.floorPos.x += -this.cubeVel.x;
            block.floorPos.y += -this.cubeVel.y;
        });
    }
    scrollEnemies() {
        this.enemies.forEach(enemy => {
            enemy.spotlightPos.x += -this.cubeVel.x;
            enemy.spotlightPos.y += -this.cubeVel.y;
            enemy.light.lightPos.x += -this.cubeVel.x;
            enemy.light.lightPos.y += -this.cubeVel.y;
            enemy.bullets.forEach(bullet => {
                bullet.bulletPos.x += -this.cubeVel.x;
                bullet.bulletPos.y += -this.cubeVel.y;
            });
            // keep spotlight movement range
            enemy.maxPosX.l += -this.cubeVel.x;
            enemy.maxPosX.r += -this.cubeVel.x;
        });
    }
    gravity() {
        this.cubeVel.y += this.cubePhysics.gravity;
    }
    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.cubeVel.y -= this.cubeVel.maxVelY;
        }
        this.unblockIfHidding();
    }
    checkFloorAndWallCollision() {
        // Collision Cube Rects
        let horizontalRect = {
            x: this.cubePos.x + this.cubeVel.x,
            y: this.cubePos.y,
            width: this.cubeSize.w,
            height: this.cubeSize.h
        };
        let verticalRect = {
            x: this.cubePos.x,
            y: this.cubePos.y + this.cubeVel.y,
            width: this.cubeSize.w,
            height: this.cubeSize.h
        };
        this.floorBlocks.forEach((block, i) => {
            // Collision Block Rect
            let blockRect = {
                x: block.floorPos.x,
                y: block.floorPos.y,
                width: block.width,
                height: block.height,
            };
            if (block instanceof BrokenPlatform) {
                blockRect.width = 100;
            }
            // Check collisions
            if ((block instanceof FloorBlock) || (block instanceof DoggyPlatform)) {
                if (this.checkRectCollision(horizontalRect, blockRect)) {
                    while (this.checkRectCollision(horizontalRect, blockRect)) {
                        horizontalRect.x -= Math.sign(this.cubeVel.x);
                    }
                    this.cubePos.x = horizontalRect.x;
                    this.cubeVel.x = 0;
                    console.log('se esconde');
                    this.isHidding = true;
                    this.isFound = false;
                }
                if (this.checkRectCollision(verticalRect, blockRect)) {
                    while (this.checkRectCollision(verticalRect, blockRect)) {
                        verticalRect.y -= Math.sign(this.cubeVel.y);
                    }
                    this.cubePos.y = horizontalRect.y;
                    this.cubeVel.y = 0;
                    this.isJumping = false;
                    if (block instanceof BrokenPlatform)
                        block.isBroken = true;
                }
            }
        });
    }
    unblockIfHidding() {
        if (this.isHidding)
            this.isHidding = false;
    }
    checkRectCollision(r1, r2) {
        if (r1.x >= r2.x + r2.width) {
            return false;
        }
        else if (r1.x + r1.width <= r2.x) {
            return false;
        }
        else if (r1.y >= r2.y + r2.height) {
            return false;
        }
        else if (r1.y + r1.height <= r2.y) {
            return false;
        }
        else {
            return true;
        }
    }
}
