"use strict";
class PowerUp {
    constructor(ctx, posX, posY) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.powerUpPos = { x: this.posX, y: this.posY };
        this.powerUpSize = { w: 80, h: 80 };
        this.isAvailable = true;
        this.isActive = false;
    }
    draw() {
        var _a;
        if (this.isAvailable) {
            this.ctx.fillStyle = 'white';
        }
        else {
            this.ctx.fillStyle = 'red';
        }
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.powerUpPos.x, this.powerUpPos.y, this.powerUpSize.w, this.powerUpSize.h);
    }
}
class InvisibleCube extends PowerUp {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.imageInstance = new Image();
        this.imageInstance.src = './images/power-ups/invisible-cube.png';
    }
    draw() {
        this.isAvailable ? this.ctx.globalAlpha = 1 : this.ctx.globalAlpha = 0.15;
        this.ctx.drawImage(this.imageInstance, this.powerUpPos.x, this.powerUpPos.y, this.powerUpSize.w, this.powerUpSize.h);
        this.ctx.globalAlpha = 1;
    }
}
class TurnOffLights extends PowerUp {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.imageInstance = new Image();
        this.imageInstance.src = './images/power-ups/lights-off.png';
    }
    draw() {
        this.isAvailable ? this.ctx.globalAlpha = 1 : this.ctx.globalAlpha = 0.15;
        this.ctx.drawImage(this.imageInstance, this.powerUpPos.x, this.powerUpPos.y, this.powerUpSize.w, this.powerUpSize.h);
        this.ctx.globalAlpha = 1;
    }
}
