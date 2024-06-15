// src/objects/Player.ts
import Phaser from 'phaser';
import OxygenTank from "./OxygenTank";
import InventoryHUD from "./InventoryHUD.ts";

export default class Player extends Phaser.Physics.Arcade.Sprite {

    private inventoryHUD: InventoryHUD;
    oxygenTank: OxygenTank;
    oxygenBreathConsumptionBySecond: number;
    oxygenBurstConsumptionBySecond: number;
    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setMaxVelocity(200);
        this.body!.onOverlap = true;
        
        this.oxygenTank = new OxygenTank(this.scene, this.x, this.y, 100);
        // this.oxygenBreathConsumptionBySecond = 1.0;
        this.oxygenBreathConsumptionBySecond = 0;
        // this.oxygenBurstConsumptionBySecond = 10.0;
        this.oxygenBurstConsumptionBySecond = 0;
        
        this.inventoryHUD = new InventoryHUD(scene, 30, 55, 3, 40, 10);
        this.inventoryHUD.setScrollFactor(0);
        this.inventoryHUD.addItemToSlot(0, 'ship');
    }

    update (time: number, delta: number)
    {
        const delta_seconds: number = delta / 1000.0;
        
        // Oxygen is always consumed by breathing
        this.oxygenTank.consumeOxygen(this.oxygenBreathConsumptionBySecond * delta_seconds);
        this.oxygenTank.setPosition(this.x - 26, this.y - 30);
    }
}