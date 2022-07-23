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
        this.spotlightSize = { w: 70, h: 70 };
        this.spotlightCenter = this.spotlightSize.w / 2;
        this.spotlightVel = { x: 0, y: 0 };
        this.isMovingLeft = undefined;
        this.isMovingRight = undefined;
        this.light = undefined;
        this.bullets = [];
        this.initSpotlight();
    }
    initSpotlight() {
        this.draw();
        this.setDirection();
        this.createLight();
    }
    draw() {
        var _a;
        this.ctx.fillStyle = 'white';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.spotlightPos.x, this.spotlightPos.y, this.spotlightSize.w, this.spotlightSize.h);
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
