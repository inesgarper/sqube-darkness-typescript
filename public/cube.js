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
        this.isHidding = false;
        this.isFound = false;
        this.isJumping = false;
        this.isInvisible = false;
        this.canSpinRight = false;
        this.leftKey = undefined;
        this.rightKey = undefined;
        this.imageInstance = new Image();
        this.imageInstance.src = './images/cube/cube2.png';
        this.imageInstance.frames = 9;
        this.imageInstance.framesIndex = 0;
    }
    draw(framesCounter) {
        // if (this.isHidding) {
        //     this.ctx!.fillStyle = 'black'
        // } else if (this.isFound) {
        //     this.ctx!.fillStyle = 'red'
        // } else if (this.isInvisible) {
        //     this.ctx!.fillStyle = 'rgba(0, 0, 0, 0.1)'
        // } else {
        //     this.ctx!.fillStyle = 'green'
        // }
        // this.ctx?.fillRect(this.cubePos.x, this.cubePos.y, this.cubeSize.w, this.cubeSize.h)
        this.isInvisible ? this.ctx.globalAlpha = 0.1 : this.ctx.globalAlpha = 1;
        this.ctx.drawImage(this.imageInstance, this.imageInstance.framesIndex * (this.imageInstance.width / this.imageInstance.frames), 0, this.imageInstance.width / this.imageInstance.frames, this.imageInstance.height, this.cubePos.x, this.cubePos.y, this.cubeSize.w, this.cubeSize.h);
        this.ctx.globalAlpha = 1;
        if (this.rightKey && this.isJumping)
            this.canSpinRight = true;
        this.gravity();
    }
    spinRight(framesCounter) {
        if (this.canSpinRight) {
            if (framesCounter % 2 == 0) {
                this.imageInstance.framesIndex--;
            }
            if (this.imageInstance.framesIndex < 0) {
                this.imageInstance.framesIndex = 8;
            }
            if (this.imageInstance.framesIndex === 0)
                this.canSpinRight = false;
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
        this.cubeVel.x++;
        this.unblockIfHidding();
    }
    moveLeft() {
        this.cubeVel.x--;
        this.unblockIfHidding();
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
        // let horizontalRect = {
        //     x: this.cubePos.x + this.cubeVel.x + 10.395,
        //     y: this.cubePos.y + 10.395,
        //     width: this.cubeSize.w - 20.29,
        //     height: this.cubeSize.h - 20.29
        // }
        // let verticalRect = {
        //     x: this.cubePos.x + 10.395,
        //     y: this.cubePos.y + this.cubeVel.y + 10.395,
        //     width: this.cubeSize.w - 20.29,
        //     height: this.cubeSize.h - 20.29
        // }
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
// HASTA AQUÍ PUEDES BORRAR QUERIDO
