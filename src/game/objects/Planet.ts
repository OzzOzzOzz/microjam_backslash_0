import Phaser, {GameObjects} from 'phaser';
export default class Planet extends Phaser.Physics.Arcade.Sprite {
    
    planetSprite: GameObjects.Sprite
    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, radius: number)
    {
        super(scene, x, y, texture);

        scene.physics.add.existing(this);
        
        this.planetSprite =  this.scene.physics.add.sprite(this.x, this.y, 'planet');
        this.planetSprite.setCircle(this.planetSprite.texture.source[0].width / 2);
        this.planetSprite.displayWidth = radius;
        this.planetSprite.displayHeight = radius;
    }
}
