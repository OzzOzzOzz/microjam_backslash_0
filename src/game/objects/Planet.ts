import Phaser from 'phaser';

export default class Planet extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, radius: number)
    {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.body!.setCircle(this.texture.source[0].width / 2);
        this.setImmovable(true);
        this.displayWidth = radius;
        this.displayHeight = radius;
    }
}
