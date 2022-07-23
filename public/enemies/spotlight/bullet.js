"use strict";
class Bullet {
    constructor(ctx, bulletPos, spotlightPos, cube, floorBlocks) {
        this.ctx = ctx;
        this.bulletPos = bulletPos;
        this.spotlightPos = spotlightPos;
        this.cube = cube;
        this.floorBlocks = floorBlocks;
        this.bulletPos = { x: this.bulletPos.x, y: this.bulletPos.y };
        this.bulletSize = { w: 10, h: 10 };
        this.bulletVel = { x: 0, y: 0 };
        this.initGun();
    }
    initGun() {
        this.draw();
        this.update();
    }
    draw() {
        var _a;
        this.ctx.fillStyle = 'black';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.bulletPos.x, this.bulletPos.y, this.bulletSize.w, this.bulletSize.h);
    }
    update() {
        this.floorBlocks.forEach(block => {
            // Take the platform where the cube is placed as shoot's direction of reference
            if (block.floorPos.x <= this.cube.cubePos.x + 50 && block.floorPos.x >= this.cube.cubePos.x - 50) {
                const angle = Math.atan2(block.floorPos.y - this.bulletPos.y, block.floorPos.x - this.bulletPos.x);
                this.bulletVel.x = Math.cos(angle);
                this.bulletVel.y = Math.sin(angle);
            }
        });
    }
    move() {
        this.bulletPos.x += this.bulletVel.x * 5;
        this.bulletPos.y += this.bulletVel.y * 5;
    }
}
