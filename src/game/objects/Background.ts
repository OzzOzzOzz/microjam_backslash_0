// src/objects/Player.ts
import Phaser, {GameObjects} from 'phaser';

export default class Background {
    private spaceBackgroundStars: {
        "behind": GameObjects.TileSprite,
        "middle": GameObjects.TileSprite,
        "front": GameObjects.TileSprite,
    };
    private scene: Phaser.Scene

    constructor(scene: Phaser.Scene)
    {
        this.scene = scene;
        this.spaceBackgroundStars = {
            "behind": this.scene.add.tileSprite(
                0,
                0,
                this.scene.physics.world.bounds.width,
                this.scene.physics.world.bounds.height,
                'behindStars'
            ).setScrollFactor(0).setOrigin(0, 0).setTileScale(2, 2),
            "middle": this.scene.add.tileSprite(
                0,
                0,
                this.scene.physics.world.bounds.width,
                this.scene.physics.world.bounds.height,
                'middleStars'
            ).setScrollFactor(0).setOrigin(0, 0).setTileScale(2, 2),
            "front": this.scene.add.tileSprite(
                0,
                0,
                this.scene.physics.world.bounds.width,
                this.scene.physics.world.bounds.height,
                'frontStars'
            ).setScrollFactor(0).setOrigin(0, 0).setTileScale(2, 2),
        };
    }

    update (delta: number)
    {
        console.log(delta)
        const parallaxFactor = 0.4;
        const behindStarsFactor = 0.015 * parallaxFactor;
        const middleStarsFactor = 0.1 * parallaxFactor;
        const frontStarsFactor = 0.75 * parallaxFactor;
        this.spaceBackgroundStars.behind.tilePositionX = this.scene.cameras.main.scrollX * behindStarsFactor;
        this.spaceBackgroundStars.behind.tilePositionY = this.scene.cameras.main.scrollY * behindStarsFactor;
        this.spaceBackgroundStars.middle.tilePositionX = this.scene.cameras.main.scrollX * middleStarsFactor;
        this.spaceBackgroundStars.middle.tilePositionY = this.scene.cameras.main.scrollY * middleStarsFactor;
        this.spaceBackgroundStars.front.tilePositionX = this.scene.cameras.main.scrollX * frontStarsFactor;
        this.spaceBackgroundStars.front.tilePositionY = this.scene.cameras.main.scrollY * frontStarsFactor;
    }
}