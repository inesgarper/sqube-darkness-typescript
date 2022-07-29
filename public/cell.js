"use strict";
class Cell {
    constructor(ctx, posX, posY) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.ctx = ctx;
        this.pos = { x: this.posX, y: this.posY };
        this.size = { w: 50, h: 50 };
    }
}
class MapBlock extends Cell {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
    }
    draw() {
        var _a;
        this.ctx.fillStyle = 'black';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
    }
}
// Obstacles 
class BubbleHole extends Cell {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.imageInstance = new Image();
        this.imageInstance.src = './images/bubble-hole/bubblehole.png';
        this.imageInstance.frames = 13;
        this.imageInstance.framesIndex = Math.floor(Math.random() * 12);
    }
    draw(framesCounter) {
        this.ctx.drawImage(this.imageInstance, this.imageInstance.framesIndex * (this.imageInstance.width / this.imageInstance.frames), 0, this.imageInstance.width / this.imageInstance.frames, this.imageInstance.height, this.pos.x, this.pos.y, this.size.w, this.size.h);
        this.animate(framesCounter);
    }
    animate(framesCounter) {
        if (framesCounter % 6 == 0) {
            this.imageInstance.framesIndex++;
        }
        if (this.imageInstance.framesIndex > 12) {
            this.imageInstance.framesIndex = 0;
        }
    }
}
class Spike extends Cell {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.imageInstance = new Image();
        this.imageInstance.src = './images/spikes/spikes.png';
    }
    draw() {
        this.ctx.drawImage(this.imageInstance, this.pos.x, this.pos.y, this.size.w, this.size.h);
    }
}
class TempSpike extends Spike {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.spikeVel = 0;
        this.movedDistance = 0;
        this.onTop = true;
        this.onBottom = false;
    }
    draw() {
        this.ctx.drawImage(this.imageInstance, this.pos.x, this.pos.y, this.size.w, this.size.h);
    }
    moveUp() {
        this.spikeVel = -8;
        this.pos.y += this.spikeVel;
        this.movedDistance += this.spikeVel;
    }
    moveDown() {
        this.spikeVel = +8;
        this.pos.y += this.spikeVel;
        this.movedDistance += this.spikeVel;
    }
    move() {
        if (this.movedDistance >= 50) {
            this.onTop = false;
            setTimeout(() => {
                this.onBottom = true;
            }, 1000);
        }
        else if (this.movedDistance === 0) {
            this.onBottom = false;
            setTimeout(() => {
                this.onTop = true;
            }, 1000);
        }
        if (this.onTop)
            this.moveDown();
        else if (this.onBottom)
            this.moveUp();
    }
}
class BrokenPlatform extends MapBlock {
    constructor(ctx, posX, posY) {
        super(ctx, posX, posY);
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.brokenPlatformVel = { x: 0, y: 0 };
        this.brokenPlatformPhysics = { gravity: 0.5 };
        this.isBroken = false;
        this.isDoneBreaking = false;
        this.imageInstance = new Image();
        this.imageInstance.src = './images/broken-platform/broken-platform.png';
        this.imageInstance.frames = 10;
        this.imageInstance.framesIndex = 0;
    }
    drawPlatform(framesCounter) {
        this.ctx.drawImage(this.imageInstance, this.imageInstance.framesIndex * (this.imageInstance.width / this.imageInstance.frames), 0, this.imageInstance.width / this.imageInstance.frames, this.imageInstance.height, this.pos.x, this.pos.y, this.size.w + 50, this.size.h);
        if (this.isDoneBreaking)
            this.animate(framesCounter);
    }
    animate(framesCounter) {
        if (this.isDoneBreaking) {
            if (framesCounter % 3 == 0) {
                this.imageInstance.framesIndex++;
            }
        }
    }
    break() {
        setTimeout(() => {
            this.brokenPlatformVel.y += this.brokenPlatformPhysics.gravity;
            this.pos.y += this.brokenPlatformVel.y;
            this.isDoneBreaking = true;
        }, 400);
    }
}
