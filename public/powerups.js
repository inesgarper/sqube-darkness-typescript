"use strict";
class PowerUp {
    constructor(ctx, posX, posY) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.powerUpPos = { x: this.posX, y: this.posY };
        this.powerUpSize = { w: 50, h: 100 };
        this.isAvailable = true;
        this.isActive = false;
        this.initPowerups();
    }
    initPowerups() {
        this.draw();
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
    }
}
class TurnOffLights extends PowerUp {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
    }
}
