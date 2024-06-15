// src/objects/Player.ts
import Phaser from 'phaser';
import OxygenTank from "./OxygenTank";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    oxygenTank: OxygenTank;
    oxygenBreathConsumptionBySecond: number;
    oxygenBurstConsumptionBySecond: number;
    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setMaxVelocity(200);
        
        this.oxygenTank = new OxygenTank(this.scene, this.x, this.y, 100);
        this.oxygenBreathConsumptionBySecond = 1.0;
        this.oxygenBurstConsumptionBySecond = 10.0;
        
    }

    update (time: number, delta: number)
    {
        const delta_seconds: number = delta / 1000.0;
        
        // Oxygen is always consumed by breathing
        this.oxygenTank.consumeOxygen(this.oxygenBreathConsumptionBySecond * delta_seconds);
        this.oxygenTank.setPosition(this.x - 26, this.y - 30);
    }
}