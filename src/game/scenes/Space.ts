import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Space extends Scene
{
    spaceBackground: GameObjects.Image;


    constructor() {
        super('Space');
    }

    create ()
    {
        const screenWidth: number = this.sys.game.config.width as number;
        const screenHeight: number = this.sys.game.config.height as number;

        this.spaceBackground = this.add.image(
            screenWidth / 2,
            screenHeight / 2,
              'spaceBackground'
          );
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}