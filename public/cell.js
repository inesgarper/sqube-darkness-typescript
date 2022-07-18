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
    }
    drawBlock() {
        var _a;
        this.ctx.fillStyle = '#8f9ed0';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height);
    }
}
class BrokenPlatform extends Cell {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
    }
    drawBlock() {
        var _a;
        this.ctx.fillStyle = '#f3e600';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height);
    }
}
// ELIMINAR Y METER EN ENEMIGOS
class Doggy extends Cell {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
    }
    drawBlock() {
        var _a;
        this.ctx.fillStyle = '#75b835';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height);
    }
}
