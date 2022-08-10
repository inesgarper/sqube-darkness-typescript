"use strict";
class Gun {
    constructor(ctx, gunPos) {
        this.ctx = ctx;
        this.gunPos = gunPos;
        this.gunPos = { x: this.gunPos.x, y: this.gunPos.y };
        this.gunSize = { w: 10, h: 10 };
        this.gunVel = { x: 0, y: 0 };
    }
}
