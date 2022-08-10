"use strict";
class Bullet {
    constructor(ctx, pos, cube) {
        this.ctx = ctx;
        this.pos = pos;
        this.cube = cube;
        this.pos = { x: this.pos.x, y: this.pos.y };
        this.size = { w: 10, h: 10 };
        this.vel = { x: 0, y: 0 };
        this.initGun();
    }
    initGun() {
        this.draw();
        this.updateDirection();
    }
    draw() {
        var _a;
        this.ctx.fillStyle = 'black';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
    }
    updateDirection() {
        const angle = Math.atan2(this.cube.pos.y + this.cube.center - this.pos.y, this.cube.pos.x + this.cube.center - this.pos.x);
        this.vel.x = Math.cos(angle);
        this.vel.y = Math.sin(angle);
    }
    move() {
        this.pos.x += this.vel.x * 15;
        this.pos.y += this.vel.y * 15;
    }
}
