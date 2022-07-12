"use strict";
class Cube {
    constructor(ctx, posX, posY) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.ctx = ctx;
        this.cubePos = { x: posX, y: posY };
        this.cubeSize = { w: 60, h: 60 };
        this.cubeVel = { x: 1, y: 0.5 };
        this.cubePhysics = { gravity: 0.1 };
        this.initCube();
    }
    initCube() {
        console.log('ME INICIALIZO');
        this.drawCube();
    }
    drawCube() {
        var _a;
        this.ctx.fillStyle = 'black';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.posX, this.posY, 50, 50);
        console.log('ME DIBUJO');
    }
}
