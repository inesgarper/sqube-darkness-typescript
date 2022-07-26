"use strict";
class Spotlight {
    constructor(ctx, posX, posY, maxPosXLeft, maxPosXRight, initialDirection) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.maxPosXLeft = maxPosXLeft;
        this.maxPosXRight = maxPosXRight;
        this.initialDirection = initialDirection;
        this.spotlightPos = { x: this.posX, y: this.posY };
        this.maxPosX = { l: this.maxPosXLeft, r: this.maxPosXRight };
        this.spotlightSize = { w: 80, h: 80 };
        this.spotlightCenter = this.spotlightSize.w / 2;
        this.spotlightVel = { x: 0, y: 0 };
        this.playerFound = false;
        this.isMovingLeft = undefined;
        this.isMovingRight = undefined;
        this.initSpotlight();
    }
    initSpotlight() {
        this.draw();
        this.setDirection();
    }
    draw() {
        var _a;
        // Base
        this.ctx.fillStyle = 'white';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.spotlightPos.x, this.spotlightPos.y, this.spotlightSize.w, this.spotlightSize.h);
        // Light
        // this.ctx!.beginPath();
        // this.ctx!.moveTo(this.spotlightPos.x + this.spotlightCenter - 200, 350);
        // this.ctx!.lineTo(this.spotlightPos.x + this.spotlightCenter + 200, 350);
        // this.ctx!.lineTo(this.spotlightPos.x + this.spotlightCenter, this.spotlightPos.y + this.spotlightCenter);
        // this.ctx!.closePath();
        this.ctx.fillStyle = "#FFCC00";
        this.ctx.fillRect(this.spotlightPos.x + 100, this.spotlightPos.y + 100, this.spotlightSize.w + 100, this.spotlightSize.h + 100);
        // this.ctx!.fill();
    }
    drawBase() {
    }
    drawLight() {
    }
    setDirection() {
        if (this.initialDirection === 'left') {
            this.isMovingLeft = true;
            this.isMovingRight = false;
        }
        else if (this.initialDirection === 'right') {
            this.isMovingRight = true;
            this.isMovingLeft = false;
        }
    }
    move() {
        if (this.isMovingRight) {
            if (this.spotlightPos.x < this.maxPosX.r) {
                this.spotlightPos.x++;
            }
            else {
                this.isMovingRight = false;
                this.isMovingLeft = true;
            }
        }
        else if (this.isMovingLeft) {
            if (this.spotlightPos.x > this.maxPosX.l) {
                this.spotlightPos.x--;
            }
            else {
                this.isMovingRight = true;
                this.isMovingLeft = false;
            }
        }
    }
}
// version cuadrado girado
// const lightGradient = this.ctx!.createLinearGradient(
//     this.spotlightPos.x + 100 + this.spotlightSize.w / 2,
//     this.spotlightPos.y + 100,
//     this.spotlightPos.x + 100 + this.spotlightSize.w / 2,
//     this.spotlightSize.h + 200
// );
// lightGradient.addColorStop(0, "#EAE22A");
// lightGradient.addColorStop(1, "#DFDFDF00");
// this.ctx!.fillStyle = lightGradient
// this.ctx?.fillRect(this.spotlightPos.x + 100, this.spotlightPos.y + 100, this.spotlightSize.w + 100, this.spotlightSize.h + 200)
