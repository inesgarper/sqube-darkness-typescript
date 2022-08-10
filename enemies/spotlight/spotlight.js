"use strict";
class Spotlight {
    constructor(ctx, posX, posY, maxPosXLeft, maxPosXRight, initialDirection, cube, floorBlocks) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.maxPosXLeft = maxPosXLeft;
        this.maxPosXRight = maxPosXRight;
        this.initialDirection = initialDirection;
        this.cube = cube;
        this.floorBlocks = floorBlocks;
        this.pos = { x: this.posX, y: this.posY };
        this.maxPosX = { l: this.maxPosXLeft, r: this.maxPosXRight };
        this.size = { w: 80, h: 80 };
        this.center = this.size.w / 2;
        this.isMovingLeft = undefined;
        this.isMovingRight = undefined;
        this.light = undefined;
        this.bullets = [];
        this.imageInstance = new Image();
        this.imageInstance.frames = 18;
        this.imageInstance.framesIndex = 0;
        this.imageInstance.src = './images/spotlight/spotlight.png';
        this.initSpotlight();
    }
    initSpotlight() {
        this.setDirection();
        this.createLight();
    }
    draw(framesCounter) {
        this.ctx.drawImage(this.imageInstance, this.imageInstance.framesIndex * (this.imageInstance.width / this.imageInstance.frames), 0, this.imageInstance.width / this.imageInstance.frames, this.imageInstance.height, this.pos.x, this.pos.y, this.size.w, this.size.h);
        this.animate(framesCounter);
    }
    animate(framesCounter) {
        if (framesCounter % 5 == 0) {
            this.imageInstance.framesIndex++;
        }
        if (this.imageInstance.framesIndex >= this.imageInstance.frames) {
            this.imageInstance.framesIndex = 0;
        }
    }
    setImageSrc() {
        var _a;
        if ((_a = this.light) === null || _a === void 0 ? void 0 : _a.isOn) {
            this.imageInstance.src = './images/spotlight/spotlight.png';
        }
        else {
            this.imageInstance.src = './images/spotlight/spotlight-off.png';
        }
    }
    setDirection() {
        if (this.initialDirection === 'left') {
            this.isMovingLeft = true;
            this.isMovingRight = false;
        }
        else if (this.initialDirection === 'right') {
            this.isMovingRight = true;
            this.isMovingLeft = false;
        }
    }
    move() {
        if (this.isMovingRight) {
            if (this.pos.x < this.maxPosX.r) {
                this.pos.x += 2;
            }
            else {
                this.isMovingRight = false;
                this.isMovingLeft = true;
            }
        }
        else if (this.isMovingLeft) {
            if (this.pos.x > this.maxPosX.l) {
                this.pos.x -= 2;
            }
            else {
                this.isMovingRight = true;
                this.isMovingLeft = false;
            }
        }
    }
    createLight() {
        this.light = new Light(this.ctx, this.pos, this.maxPosX, this.size, this.center, this.initialDirection);
    }
    shoot(framesCounter) {
        if (this.cube.isFound) {
            if (framesCounter % 70 === 0)
                this.createBullets();
        }
    }
    createBullets() {
        this.bullets.push(new Bullet(this.ctx, { x: this.pos.x + this.center, y: this.pos.y + this.center }, this.cube));
    }
    deleteCollisionedBullet(index) {
        this.bullets.splice(index, 1);
    }
}
