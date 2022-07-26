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
        this.imageInstance = new Image();
        this.imageInstance.frames = 9;
        this.imageInstance.framesIndex = 0;
        this.imageInstance.src = './images/doggy/doggy-sprite.png';
        // this.initFloor()
    }
    // initFloor(): void {
    // console.log('POSICION INICIAL ----->', this.floorPos.x)
    // this.drawBlock()
    // }
    drawBlock(framesCounter) {
        this.ctx.drawImage(this.imageInstance, this.imageInstance.framesIndex * (this.imageInstance.width / this.imageInstance.frames), 0, this.imageInstance.width / this.imageInstance.frames, this.imageInstance.height, this.floorPos.x, this.floorPos.y, this.width, this.height);
        this.animate(framesCounter);
        // this.isActive ? this.ctx!.fillStyle = '#75b835' : this.ctx!.fillStyle = '#253a0f'
        // this.ctx?.fillRect(this.floorPos.x, this.floorPos.y, this.width, this.height)
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
