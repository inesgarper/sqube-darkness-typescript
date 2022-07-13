"use strict";
class FloorBlock {
    constructor(ctx, posX, posY, width, height) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.floorPos = { x: posX, y: posY };
        this.floorSize = { w: width, h: height };
        this.initFloor();
    }
    initFloor() {
        this.drawFloor();
    }
    drawFloor() {
        var _a;
        this.ctx.fillStyle = 'black';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.floorPos.x, this.floorPos.y, this.floorSize.w, this.floorSize.h);
    }
}
