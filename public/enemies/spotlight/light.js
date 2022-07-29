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
        this.pos = { x: this.spotlightPos.x - 300, y: this.spotlightPos.y + 180 };
        this.size = { w: this.spotlightSize.w + 600, h: this.spotlightSize.h + 600 };
        this.rotation = 45;
        this.isOn = true;
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
        (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.translate(this.pos.x + (this.size.w / 2), this.pos.y + (this.size.h / 2));
        (_c = this.ctx) === null || _c === void 0 ? void 0 : _c.rotate(this.rotation * Math.PI / 180);
        (_d = this.ctx) === null || _d === void 0 ? void 0 : _d.translate(-(this.pos.x + this.size.w / 2), -(this.pos.y + this.size.h / 2));
        const lightGradient = this.ctx.createLinearGradient(0, 0, 1800, 1800);
        lightGradient.addColorStop(0, 'rgba(255,255,255,0.7)');
        lightGradient.addColorStop(0.2, 'rgba(255,255,255,0.5)');
        lightGradient.addColorStop(0.4, 'rgba(255,255,255,0.1)');
        lightGradient.addColorStop(0.9, 'rgba(255,255,255,0)');
        this.ctx.fillStyle = lightGradient;
        (_e = this.ctx) === null || _e === void 0 ? void 0 : _e.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
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
                this.pos.x += 2;
            }
            else {
                this.isMovingRight = false;
                this.isMovingLeft = true;
            }
        }
        else if (this.isMovingLeft) {
            if (this.spotlightPos.x > this.maxPosX.l) {
                this.pos.x -= 2;
            }
            else {
                this.isMovingRight = true;
                this.isMovingLeft = false;
            }
        }
    }
}
