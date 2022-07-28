"use strict";
class Cube {
    constructor(ctx, posX, posY, floorBlocks, enemies) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.floorBlocks = floorBlocks;
        this.enemies = enemies;
        this.cubePos = { x: this.posX, y: this.posY };
        this.cubeSize = { w: 70.79, h: 70.79 };
        this.cubeCenter = this.cubeSize.w / 2;
        this.cubeVel = { x: 0, y: 0, maxVelX: 5, maxVelY: 20 };
        this.cubePhysics = { gravity: 0.5, friction: 0.6 };
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
        if (this.isFacingRight)
            this.imageSrc = this.imageInstanceRight;
        if (this.isFacingLeft)
            this.imageSrc = this.imageInstanceLeft;
        if (this.isHidding)
            this.imageSrc = this.imageInstanceHidden;
        if (this.isDead)
            this.imageSrc = this.imageInstanceGameOver;
        this.isInvisible ? this.ctx.globalAlpha = 0.1 : this.ctx.globalAlpha = 1;
        if (this.imageSrc === this.imageInstanceHidden) {
            this.ctx.drawImage(this.imageSrc, this.cubePos.x, this.cubePos.y, this.cubeSize.w, this.cubeSize.h);
        }
        else {
            this.ctx.drawImage(this.imageSrc, this.imageSrc.framesIndex * (this.imageSrc.width / this.imageSrc.frames), 0, this.imageSrc.width / this.imageSrc.frames, this.imageSrc.height, this.cubePos.x, this.cubePos.y, this.cubeSize.w, this.cubeSize.h);
        }
        this.ctx.globalAlpha = 1;
        this.gravity();
    }
    animate(framesCounter) {
        this.cubeSize.w = 120.79;
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
        if (this.cubePos.x < 400 /* && this.cubePos.x > 50 */) {
            this.cubePos.x += this.cubeVel.x;
            this.cubePos.y += this.cubeVel.y;
        }
        else {
            this.scrollPlatforms();
            this.scrollEnemies();
        }
        // Horizontal movement
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
            if (!this.isDead)
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
            width: this.cubeSize.w - 20.79,
            height: this.cubeSize.h - 11
        };
        let verticalRect = {
            x: this.cubePos.x,
            y: this.cubePos.y + this.cubeVel.y,
            width: this.cubeSize.w - 20.79,
            height: this.cubeSize.h - 11
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
                if (!this.isDead) {
                    if (this.checkRectCollision(horizontalRect, blockRect)) {
                        while (this.checkRectCollision(horizontalRect, blockRect)) {
                            horizontalRect.x -= Math.sign(this.cubeVel.x);
                        }
                        this.cubePos.x = horizontalRect.x;
                        this.cubeVel.x = 0;
                        this.isHidding = true;
                        this.isFound = false;
                    }
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
