// src/objects/Player.ts
import Phaser from 'phaser';
import OxygenTank from "./OxygenTank";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private oxygenTank: OxygenTank;
    private oxygenBreathConsumptionBySecond: number;
    private oxygenBurstConsumptionBySecond: number;
    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, cursors: Phaser.Types.Input.Keyboard.CursorKeys)
    {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.cursors = cursors;
        
        this.oxygenTank = new OxygenTank(this.scene, this.x, this.y, 100);
        this.oxygenBreathConsumptionBySecond = 1.0;
        this.oxygenBurstConsumptionBySecond = 10.0;
        
    }
    
    create ()
    {
        this.scene.physics.add.image(400, 300, 'ship');

        this.setDamping(true);
        this.setDrag(0.99);
        this.setMaxVelocity(200);
    }

    update (time: number, delta: number)
    {
        const delta_seconds: number = delta / 1000.0;
        
        // Oxygen is always consumed by breathing
        this.oxygenTank.consumeOxygen(this.oxygenBreathConsumptionBySecond * delta_seconds);
        
        if (this.cursors.up.isDown)
        {
            // Oxygen is lot consumed when we burst
            if (!this.oxygenTank.isEmpty())
            {
                this.oxygenTank.consumeOxygen(this.oxygenBurstConsumptionBySecond * delta_seconds);
                this.scene.physics.velocityFromRotation(this.rotation, 200, this.body!.acceleration);
            }
            else
            {
                this.setAcceleration(0);
            }
        }
        else
        {
            this.setAcceleration(0);
        }

        if (this.cursors.left.isDown)
        {
            this.setAngularVelocity(-300);
        }
        else if (this.cursors.right.isDown)
        {
            this.setAngularVelocity(300);
        }
        else
        {
            this.setAngularVelocity(0);
        }

        this.scene.physics.world.wrap(this, 32);
        this.oxygenTank.setPosition(this.x - 26, this.y - 30);
        //this.scene.physics.world.wrap(this, 302);
    }
}