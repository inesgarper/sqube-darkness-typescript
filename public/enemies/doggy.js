"use strict";
class Doggy {
    constructor(ctx, posX, posY) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.ctx = ctx;
        this.initialPos = { x: posX, y: posY };
        this.pos = { x: posX, y: posY };
        this.vel = 0;
        this.maxPosX = { l: (posX - 350), r: posX };
        this.size = { w: 50, h: 50 };
        this.isActive = true;
        this.canMove = false;
        this.movedDistance = 0;
        this.touchedLeft = false;
        this.touchedRight = true;
        this.imageInstance = new Image();
        this.imageInstance.frames = 9;
        this.imageInstance.framesIndex = 0;
        this.imageInstance.src = './images/doggy/doggy-sprite.png';
    }
    draw(framesCounter) {
        this.ctx.drawImage(this.imageInstance, this.imageInstance.framesIndex * (this.imageInstance.width / this.imageInstance.frames), 0, this.imageInstance.width / this.imageInstance.frames, this.imageInstance.height, this.pos.x, this.pos.y, this.size.w, this.size.h);
        this.animate(framesCounter);
        this.move();
    }
    animate(framesCounter) {
        if (framesCounter % 5 == 0) {
            this.imageInstance.framesIndex++;
        }
        if (this.imageInstance.framesIndex >= this.imageInstance.frames) {
            this.imageInstance.framesIndex = 0;
        }
    }
    move() {
        if (this.canMove) {
            if (this.movedDistance >= 350) {
                this.touchedRight = false;
                if (this.isActive)
                    this.touchedLeft = true;
                else if (!this.isActive) {
                    setTimeout(() => {
                        this.touchedLeft = true;
                    }, 1500);
                }
            }
            else if (this.movedDistance === 0) {
                this.touchedLeft = false;
                this.touchedRight = true;
            }
            if (this.touchedRight) {
                this.vel = 7;
                this.pos.x -= this.vel;
                this.movedDistance += this.vel;
            }
            else if (this.touchedLeft) {
                this.vel = -7;
                this.pos.x -= this.vel;
                this.movedDistance += this.vel;
                if (this.movedDistance <= 0)
                    this.canMove = false;
            }
        }
    }
}
