"use strict";
class Cube {
    constructor(ctx, posX, posY) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.ctx = ctx;
        this.cubePos = { x: posX, y: posY };
        // this.cubeSize = { w: 60, h: 60 }
        this.cubeVel = { x: 0, y: 0 };
        this.cubePhysics = { gravity: 0.3 };
        this.initCube();
    }
    initCube() {
        this.drawCube();
    }
    drawCube() {
        var _a;
        this.ctx.fillStyle = 'black';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.cubePos.x, this.cubePos.y, 50, 50);
        this.gravity();
    }
    moveRight() {
        this.cubePos.x += 8;
    }
    moveLeft() {
        this.cubePos.x -= 8;
    }
    gravity() {
        this.cubeVel.y += this.cubePhysics.gravity;
        this.cubePos.y += this.cubeVel.y;
    }
    jump() {
        this.cubeVel.y = -13;
    }
}
