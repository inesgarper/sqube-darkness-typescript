"use strict";
class Light {
    constructor(ctx, spotlightPos, maxPosX, spotlightSize, spotlightCenter, spotlightVel, initialDirection) {
        this.ctx = ctx;
        this.spotlightPos = spotlightPos;
        this.maxPosX = maxPosX;
        this.spotlightSize = spotlightSize;
        this.spotlightCenter = spotlightCenter;
        this.spotlightVel = spotlightVel;
        this.initialDirection = initialDirection;
        this.lightPos = { x: this.spotlightPos.x - 300, y: this.spotlightPos.y + 180 };
        this.lightSize = { w: this.spotlightSize.w + 600, h: this.spotlightSize.h + 600 };
        this.rotation = 45;
        this.playerFound = false;
        this.isMovingLeft = undefined;
        this.isMovingRight = undefined;
        this.initLight();
    }
    initLight() {
        this.draw();
        this.setDirection();
    }
    draw() {
        var _a, _b, _c, _d, _e, _f;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.save();
        (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.translate(this.lightPos.x + (this.lightSize.w / 2), this.lightPos.y + (this.lightSize.h / 2));
        (_c = this.ctx) === null || _c === void 0 ? void 0 : _c.rotate(this.rotation * Math.PI / 180);
        (_d = this.ctx) === null || _d === void 0 ? void 0 : _d.translate(-(this.lightPos.x + this.lightSize.w / 2), -(this.lightPos.y + this.lightSize.h / 2));
        const lightGradient = this.ctx.createLinearGradient(this.lightPos.x + 40 + this.spotlightSize.w, this.lightPos.y + 40, this.lightPos.x + 40 + this.spotlightSize.w, this.lightSize.h + 500);
        lightGradient.addColorStop(0, "#EAE22A");
        lightGradient.addColorStop(1, "#DFDFDF00");
        this.ctx.fillStyle = lightGradient;
        (_e = this.ctx) === null || _e === void 0 ? void 0 : _e.fillRect(this.lightPos.x, this.lightPos.y, this.lightSize.w, this.lightSize.h);
        (_f = this.ctx) === null || _f === void 0 ? void 0 : _f.restore();
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
                this.lightPos.x += 2;
            }
            else {
                this.isMovingRight = false;
                this.isMovingLeft = true;
                // this.rotation += 0.5
            }
        }
        else if (this.isMovingLeft) {
            if (this.spotlightPos.x > this.maxPosX.l) {
                this.lightPos.x -= 2;
            }
            else {
                this.isMovingRight = true;
                this.isMovingLeft = false;
                // this.rotation -= 0.5
            }
        }
    }
}
