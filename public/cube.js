"use strict";
class Cube {
    constructor(ctx, posX, posY, floorBlocks) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.floorBlocks = floorBlocks;
        this.ctx = ctx;
        this.cubePos = { x: posX, y: posY };
        this.cubeSize = { w: 50, h: 50 };
        this.cubeVel = { x: 0, y: 0, maxVel: 10 };
        this.cubePhysics = { gravity: 5, friction: 0.6 };
        this.isOnSurface = false;
        this.isHidding = false;
        this.isActive = true;
        this.upKey = undefined;
        this.downKey = undefined;
        this.leftKey = undefined;
        this.rightKey = undefined;
        this.initCube();
    }
    initCube() {
        this.draw();
    }
    draw() {
        var _a;
        this.ctx.fillStyle = 'green';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.cubePos.x, this.cubePos.y, this.cubeSize.w, this.cubeSize.h);
        this.gravity();
    }
    movement() {
        if (this.isActive) {
            // Horizontal movement
            if (!this.leftKey && !this.rightKey || this.leftKey && this.rightKey) {
                this.slowDown();
            }
            else if (this.rightKey && this.cubePos.x < 400) {
                this.moveRight();
            }
            else if (this.leftKey && this.cubePos.x > 100) {
                this.moveLeft();
            }
            else {
                this.stop();
                this.scrollPlatforms();
            }
            // Jump
            if (this.upKey)
                this.jump();
            // Apply gravity
            this.gravity();
            // Correct speed
            this.regulateSpeed();
            // Define movement area
            this.checkFloorAndWallCollision();
            this.cubePos.x += this.cubeVel.x;
            this.cubePos.y += this.cubeVel.y;
        }
    }
    regulateSpeed() {
        if (this.cubeVel.x > this.cubeVel.maxVel) {
            this.cubeVel.x = this.cubeVel.maxVel;
        }
        else if (this.cubeVel.x < -this.cubeVel.maxVel) {
            this.cubeVel.x = -this.cubeVel.maxVel;
        }
        if (this.cubeVel.y > this.cubeVel.maxVel) {
            this.cubeVel.y = this.cubeVel.maxVel;
        }
        else if (this.cubeVel.y < -this.cubeVel.maxVel) {
            this.cubeVel.y = -this.cubeVel.maxVel;
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
        // this.cubePos.x += 8
        this.cubeVel.x++;
        console.log('ME MUEVO A LA DCHA');
    }
    moveLeft() {
        // this.cubePos.x -= 8
        this.cubeVel.x--;
    }
    stop() {
        this.cubeVel.x = 0;
    }
    slowDown() {
        this.cubeVel.x *= this.cubePhysics.friction;
    }
    scrollPlatforms() {
        if (this.rightKey) {
            this.floorBlocks.forEach(block => block.floorPos.x -= 5);
        }
        else if (this.leftKey) {
            this.floorBlocks.forEach(block => block.floorPos.x += 5);
        }
    }
    gravity() {
        this.cubeVel.y += this.cubePhysics.gravity;
        // this.cubePos.y += this.cubeVel.y
    }
    jump() {
        this.cubeVel.y -= 15;
        // this.cubePhysics.gravity = 0.5
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
        this.floorBlocks.forEach(block => {
            // Collision Block Rect
            let blockRect = {
                x: block.floorPos.x,
                y: block.floorPos.y,
                width: block.floorSize.w,
                height: block.floorSize.h,
            };
            // Check collisions
            if (this.checkRectCollision(horizontalRect, blockRect)) {
                while (this.checkRectCollision(horizontalRect, blockRect)) {
                    horizontalRect.x -= Math.sign(this.cubeVel.x);
                }
                this.cubePos.x = horizontalRect.x;
                this.cubeVel.x = 0;
            }
            if (this.checkRectCollision(verticalRect, blockRect)) {
                while (this.checkRectCollision(verticalRect, blockRect)) {
                    verticalRect.y -= Math.sign(this.cubeVel.y);
                }
                this.cubePos.y = horizontalRect.y;
                this.cubeVel.y = 0;
            }
        });
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
