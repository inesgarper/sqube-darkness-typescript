"use strict";
class Cell {
    constructor(ctx, posX, posY) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.ctx = ctx;
        this.floorPos = { x: posX, y: posY };
        this.width = 50;
        this.height = 50;
        this.initFloor();
    }
    initFloor() {
        this.drawBlock();
    }
    drawBlock() {
        var _a;
        this.ctx.fillStyle = 'black';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height);
    }
}
class FloorBlock extends Cell {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
    }
}
// Obstacles 
class BubbleHole extends Cell {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
    }
    drawBlock() {
        var _a;
        this.ctx.fillStyle = 'purple';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height);
    }
}
class Spike extends Cell {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
    }
    drawBlock() {
        var _a;
        this.ctx.fillStyle = '#334295';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height);
    }
}
class TempSpike extends Spike {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.prueba = 'hola';
    }
    drawBlock() {
        var _a;
        this.ctx.fillStyle = '#8f9ed0';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height);
    }
    moveUp() {
        this.floorPos.y += 6;
    }
    moveDown() {
        this.floorPos.y -= 6;
    }
}
class BrokenPlatform extends FloorBlock {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.brokenPlatformVel = { x: 0, y: 0 };
        this.brokenPlatformPhysics = { gravity: 0.5 };
        this.isBroken = false;
    }
    drawBlock() {
        var _a;
        this.ctx.fillStyle = '#f3e600';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.floorPos.x, this.floorPos.y, this.width + 50, this.height);
    }
    break() {
        setTimeout(() => {
            this.brokenPlatformVel.y += this.brokenPlatformPhysics.gravity;
            this.floorPos.y += this.brokenPlatformVel.y;
        }, 400);
    }
}
class DoggyPlatform extends Cell {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.isActive = false;
    }
    drawBlock() {
        var _a;
        this.isActive ? this.ctx.fillStyle = '#ffffff' : this.ctx.fillStyle = '#ff330b';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height);
    }
}
// HASTA AQUÍ PUEDES BORRAR QUERIDO
