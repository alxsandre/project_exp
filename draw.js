
export class Circle {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.velX = 0.5*(Math.random() - 0.5);
        this.velY = 0.5*(Math.random() - 0.5);
        this.color = color;
    }
    draw(ctx) {
        this.x += this.velX;
        this.y += this.velY;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }
    changeVel(velX, velY) {
        this.velX = velX;
        this.velY = velY;
    }
}