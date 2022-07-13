"use strict";
class Cube {
    constructor(ctx, posX, posY) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.ctx = ctx;
        this.cubePos = { x: posX, y: posY };
        // this.cubeSize = { w: 60, h: 60 }
        this.cubeVel = { x: 1, y: 0.5 };
        this.cubePhysics = { gravity: 0.1 };
        this.initCube();
    }
    // get pos(): object {
    //     return this.cubePos
    // }
    initCube() {
        this.drawCube();
    }
    drawCube() {
        var _a;
        this.ctx.fillStyle = 'black';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.cubePos.x, this.cubePos.y, 50, 50);
    }
    moveRight() {
        console.log('ME MUEVO A LA DERECHA');
        this.cubePos.x += 8;
        console.log(this.cubePos.x);
    }
}
