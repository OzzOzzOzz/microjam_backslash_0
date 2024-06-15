import Phaser from 'phaser';

export default class OxygenTank extends Phaser.GameObjects.Container {
    private bar: Phaser.GameObjects.Graphics;
    private maxOxygen: number;
    private currentOxygen: number;

    constructor(scene: Phaser.Scene, x: number, y: number, maxOxygen: number) {
        super(scene, x, y);

        this.maxOxygen = maxOxygen;
        this.currentOxygen = maxOxygen;

        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.add(this.bar);

        this.draw();

        scene.add.existing(this);
    }
    
    isEmpty() : boolean
    {
        return this.currentOxygen == 0;
    }

    consumeOxygen(amount: number) {
        this.setOxygen(this.currentOxygen - amount)
    }

    setOxygen(value: number) {
        this.currentOxygen = value;
        if (this.currentOxygen < 0) {
            this.currentOxygen = 0;
        }
        this.draw();
    }

    private draw() {
        this.bar.clear();
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(0, 0, 52, 10);
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(1, 1, 50, 8);

        const oxygenPercentage = this.currentOxygen / this.maxOxygen;
        this.bar.fillStyle(0x00ffff); // Cyan color for oxygen
        this.bar.fillRect(1, 1, 50 * oxygenPercentage, 8);
    }
}