import Phaser, {GameObjects} from 'phaser';

export default class Planet extends Phaser.Physics.Arcade.Sprite {
    
    attractionSprite: GameObjects.Sprite
    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, radius: number)
    {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.body!.setCircle(this.texture.source[0].width / 2);
        this.displayWidth = radius;
        this.displayHeight = radius;

        const attractionRadius = 2;
        this.attractionSprite =  scene.physics.add.sprite(this.x, this.y, 'planet-attraction-aura').setAlpha(0.4);
        this.attractionSprite.setCircle(this.attractionSprite.texture.source[0].width / 2);
        this.attractionSprite.displayWidth = radius * attractionRadius;
        this.attractionSprite.displayHeight = radius * attractionRadius;
        this.attractionSprite.body!.onOverlap = true;
    }
}
