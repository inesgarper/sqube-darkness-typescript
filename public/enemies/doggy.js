"use strict";
class Doggy {
    constructor(ctx, posX, posY) {
        this.ctx = ctx;
        this.posX = posX;
        this.posY = posY;
        this.ctx = ctx;
        this.initialPos = { x: posX, y: posY };
        this.floorPos = { x: posX, y: posY };
        this.doggyVel = 0;
        // this.doggyPhysics = { acceleration: 1, friction: 0.2 }
        this.range = { minX: (posX - 350), maxX: posX };
        this.width = 50;
        this.height = 50;
        this.isActive = true;
        this.canMove = false;
        this.movedDistance = 0;
        this.touchedLeft = false;
        this.touchedRight = true;
        this.initFloor();
    }
    initFloor() {
        console.log('POSICION INICIAL ----->', this.floorPos.x);
        this.drawBlock();
    }
    drawBlock() {
        var _a;
        this.isActive ? this.ctx.fillStyle = '#75b835' : this.ctx.fillStyle = '#253a0f';
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height);
        this.move();
    }
    // move(direction: number): void {
    //     if (this.doggyVel < 3) {
    //         this.doggyVel += this.doggyPhysics.acceleration
    //         this.floorPos.x -= direction * this.doggyVel
    //     } else {
    //         this.floorPos.x -= direction * 3
    //     }
    // }
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
                this.doggyVel = 7;
                this.floorPos.x -= this.doggyVel;
                this.movedDistance += this.doggyVel;
            }
            else if (this.touchedLeft) {
                this.doggyVel = -7;
                this.floorPos.x -= this.doggyVel;
                this.movedDistance += this.doggyVel;
                if (this.movedDistance <= 0)
                    this.canMove = false;
            }
        }
    }
}
// HASTA AQUÍ PUEDES BORRAR QUERIDO