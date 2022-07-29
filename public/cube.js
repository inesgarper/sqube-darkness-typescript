"use strict";
class Cube {
    constructor(ctx, posX, posY, floorBlocks) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.floorBlocks = floorBlocks;
        this.pos = { x: this.posX, y: this.posY };
        this.size = { w: 70.79, h: 70.79 };
        this.center = this.size.w / 2;
        this.vel = { x: 0, y: 0, maxVelX: 5, maxVelY: 20 };
        this.physics = { gravity: 0.5, friction: 0.6 };
        this.canMove = true;
        this.isHidding = false;
        this.isFound = false;
        this.isJumping = false;
        this.isInvisible = false;
        this.isDead = false;
        this.isFacingRight = true;
        this.isFacingLeft = false;
        this.canSpinRight = false;
        this.canSpinLeft = false;
        this.leftKey = undefined;
        this.rightKey = undefined;
        this.imageInstanceRight = new Image();
        this.imageInstanceRight.src = './images/cube/cube-right.png';
        this.imageInstanceRight.frames = 9;
        this.imageInstanceRight.framesIndex = 0;
        this.imageInstanceLeft = new Image();
        this.imageInstanceLeft.src = './images/cube/cube-left.png';
        this.imageInstanceLeft.frames = 9;
        this.imageInstanceLeft.framesIndex = 0;
        this.imageInstanceGameOver = new Image();
        this.imageInstanceGameOver.src = './images/cube/cube-gameOver.png';
        this.imageInstanceGameOver.frames = 20;
        this.imageInstanceGameOver.framesIndex = 0;
        this.imageInstanceHidden = new Image();
        this.imageInstanceHidden.src = './images/cube/cube-hidden3.png';
        this.imageSrc;
    }
    draw() {
        this.setImageSrc();
        this.isInvisible ? this.ctx.globalAlpha = 0.1 : this.ctx.globalAlpha = 1;
        if (this.imageSrc === this.imageInstanceHidden) {
            this.ctx.drawImage(this.imageSrc, this.pos.x, this.pos.y, this.size.w, this.size.h);
        }
        else {
            this.ctx.drawImage(this.imageSrc, this.imageSrc.framesIndex * (this.imageSrc.width / this.imageSrc.frames), 0, this.imageSrc.width / this.imageSrc.frames, this.imageSrc.height, this.pos.x, this.pos.y, this.size.w, this.size.h);
        }
        this.ctx.globalAlpha = 1;
        this.gravity();
    }
    setImageSrc() {
        if (this.isFacingRight)
            this.imageSrc = this.imageInstanceRight;
        if (this.isFacingLeft)
            this.imageSrc = this.imageInstanceLeft;
        if (this.isHidding)
            this.imageSrc = this.imageInstanceHidden;
        if (this.isDead)
            this.imageSrc = this.imageInstanceGameOver;
    }
    animate(framesCounter) {
        this.size.w = 120.79;
        if (framesCounter % 2 == 0) {
            this.imageSrc.framesIndex++;
        }
        if (this.imageSrc.framesIndex > 19) {
            this.imageSrc.framesIndex = 19;
        }
    }
    spinRight(framesCounter) {
        if (!this.isDead && this.canSpinRight) {
            if (framesCounter % 2 == 0) {
                this.imageSrc.framesIndex--;
            }
            if (this.imageSrc.framesIndex < 0) {
                this.imageSrc.framesIndex = 8;
            }
            if (this.imageSrc.framesIndex === 0) {
                this.canSpinRight = false;
            }
        }
    }
    spinLeft(framesCounter) {
        if (!this.isDead && this.canSpinLeft) {
            if (framesCounter % 2 == 0) {
                this.imageSrc.framesIndex++;
            }
            if (this.imageSrc.framesIndex > 8) {
                this.imageSrc.framesIndex = 0;
            }
            if (this.imageSrc.framesIndex === 0) {
                this.canSpinLeft = false;
            }
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
        if (this.pos.x < 400) {
            this.pos.x += this.vel.x;
            this.pos.y += this.vel.y;
        }
    }
    regulateSpeed() {
        if (this.vel.x > this.vel.maxVelX) {
            this.vel.x = this.vel.maxVelX;
        }
        else if (this.vel.x < -this.vel.maxVelX) {
            this.vel.x = -this.vel.maxVelX;
        }
        if (this.vel.y > this.vel.maxVelY) {
            this.vel.y = this.vel.maxVelY;
        }
        else if (this.vel.y < -this.vel.maxVelY) {
            this.vel.y = -this.vel.maxVelY;
        }
        if (this.vel.x > 0) {
            this.vel.x = Math.floor(this.vel.x);
        }
        else {
            this.vel.x = Math.ceil(this.vel.x);
        }
        if (this.vel.y > 0) {
            this.vel.y = Math.floor(this.vel.y);
        }
        else {
            this.vel.y = Math.ceil(this.vel.y);
        }
    }
    moveRight() {
        this.isFacingLeft = false;
        this.isFacingRight = true;
        if (this.isJumping)
            this.canSpinRight = true;
        this.vel.x++;
        this.unblockIfHidding();
    }
    moveLeft() {
        this.isFacingRight = false;
        this.isFacingLeft = true;
        if (this.isJumping)
            this.canSpinLeft = true;
        this.vel.x--;
        this.unblockIfHidding();
    }
    stop() {
        this.vel.x = 0;
    }
    slowDown() {
        this.vel.x *= this.physics.friction;
    }
    gravity() {
        this.vel.y += this.physics.gravity;
    }
    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.vel.y -= this.vel.maxVelY;
        }
        this.unblockIfHidding();
    }
    checkFloorAndWallCollision() {
        // Collision Cube Rects
        let cubeHorizontalRect = {
            x: this.pos.x + this.vel.x,
            y: this.pos.y,
            width: this.size.w - 20.79,
            height: this.size.h - 11
        };
        let cubeVerticalRect = {
            x: this.pos.x,
            y: this.pos.y + this.vel.y,
            width: this.size.w - 20.79,
            height: this.size.h - 11
        };
        this.floorBlocks.forEach((block, i) => {
            // Collision Block Rect
            let blockRect = {
                x: block.pos.x,
                y: block.pos.y,
                width: block.size.w,
                height: block.size.h,
            };
            if (block instanceof BrokenPlatform)
                blockRect.width = 100;
            // Check collisions
            if (this.checkRectCollision(cubeHorizontalRect, blockRect) && !this.isDead) {
                while (this.checkRectCollision(cubeHorizontalRect, blockRect)) {
                    cubeHorizontalRect.x -= Math.sign(this.vel.x);
                }
                this.pos.x = cubeHorizontalRect.x;
                this.vel.x = 0;
                this.isHidding = true;
                this.isFound = false;
            }
            if (this.checkRectCollision(cubeVerticalRect, blockRect)) {
                while (this.checkRectCollision(cubeVerticalRect, blockRect)) {
                    cubeVerticalRect.y -= Math.sign(this.vel.y);
                }
                this.pos.y = cubeHorizontalRect.y;
                this.vel.y = 0;
                this.isJumping = false;
                if (block instanceof BrokenPlatform)
                    block.isBroken = true;
            }
        });
    }
    unblockIfHidding() {
        if (this.isHidding)
            this.isHidding = false;
    }
    checkRectCollision(r1, r2) {
        if (r1.x < r2.x + r2.width &&
            r1.x + r1.width > r2.x &&
            r1.y < r2.y + r2.height &&
            r1.height + r1.y > r2.y) {
            return true;
        }
        else {
            return false;
        }
    }
}
