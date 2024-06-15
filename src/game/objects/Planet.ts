import Phaser, {GameObjects} from 'phaser';
import Player from "./Player.ts";

export default class Planet extends Phaser.Physics.Arcade.Sprite {
    
    planetSprite: GameObjects.Sprite
    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, player: Player)
    {
        super(scene, x, y, texture);

        scene.physics.add.existing(this);

        this.planetSprite =  this.scene.physics.add.sprite(this.x, this.y, 'planet');
        this.planetSprite.setScale(0.1);
    }
}
