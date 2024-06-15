// src/objects/Player.ts
import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, cursors: Phaser.Types.Input.Keyboard.CursorKeys)
    {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.cursors = cursors;
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
        if (this.cursors.up.isDown)
        {
            this.scene.physics.velocityFromRotation(this.rotation, 200, this.body!.acceleration);
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
    }
}