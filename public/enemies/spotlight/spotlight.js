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
        this.spotlightPos = { x: this.posX, y: this.posY };
        this.maxPosX = { l: this.maxPosXLeft, r: this.maxPosXRight };
        this.spotlightSize = { w: 80, h: 80 };
        this.spotlightCenter = this.spotlightSize.w / 2;
        this.spotlightVel = { x: 0, y: 0 };
        this.isMovingLeft = undefined;
        this.isMovingRight = undefined;
        this.light = undefined;
        this.bullets = [];
        this.imageInstance = new Image();
        this.imageInstance.frames = 9;
        this.imageInstance.framesIndex = 0;
        this.imageInstance.src = './images/spotlight/spotlight.png';
        this.initSpotlight();
    }
    initSpotlight() {
        // this.draw()
        this.setDirection();
        this.createLight();
    }
    draw(framesCounter) {
        this.ctx.drawImage(this.imageInstance, this.imageInstance.framesIndex * (this.imageInstance.width / this.imageInstance.frames), 0, this.imageInstance.width / this.imageInstance.frames, this.imageInstance.height, this.spotlightPos.x, this.spotlightPos.y, this.spotlightSize.w, this.spotlightSize.h);
        this.animate(framesCounter);
        // this.ctx!.fillStyle = 'white'
        // this.ctx?.fillRect(this.spotlightPos.x, this.spotlightPos.y, this.spotlightSize.w, this.spotlightSize.h)
    }
    animate(framesCounter) {
        if (framesCounter % 5 == 0) {
            this.imageInstance.framesIndex++;
        }
        if (this.imageInstance.framesIndex >= this.imageInstance.frames) {
            this.imageInstance.framesIndex = 0;
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
            if (this.spotlightPos.x < this.maxPosX.r) {
                this.spotlightPos.x += 2;
            }
            else {
                this.isMovingRight = false;
                this.isMovingLeft = true;
            }
        }
        else if (this.isMovingLeft) {
            if (this.spotlightPos.x > this.maxPosX.l) {
                this.spotlightPos.x -= 2;
            }
            else {
                this.isMovingRight = true;
                this.isMovingLeft = false;
            }
        }
    }
    createLight() {
        this.light = new Light(this.ctx, this.spotlightPos, this.maxPosX, this.spotlightSize, this.spotlightCenter, this.spotlightVel, this.initialDirection);
    }
    shoot() {
        this.bullets.push(new Bullet(this.ctx, { x: this.spotlightPos.x + this.spotlightCenter, y: this.spotlightPos.y + this.spotlightCenter }, this.spotlightPos, this.cube, this.floorBlocks));
    }
    deleteCollisionedBullet(index) {
        this.bullets.splice(index, 1);
    }
}
