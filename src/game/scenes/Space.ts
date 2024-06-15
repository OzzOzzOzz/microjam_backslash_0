import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Space extends Scene
{
    private player: Phaser.GameObjects.Graphics;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    spaceBackground: GameObjects.Image;


    constructor() {
        super('Space');
    }

    create ()
    {
        const screenHeight: number = this.sys.game.config.height as number;
        const screenWidth: number = this.sys.game.config.width as number;
        this.spaceBackground = this.add.image(
            screenWidth / 2,
            screenHeight / 2,
            'spaceBackground'
        );

        this.player = this.add.graphics();
        this.player.fillStyle(0xff0000, 1);
        this.player.fillRect(0, 0, 50, 50);
        this.player.setPosition(100, 100);

        this.cursors = this.input.keyboard!.createCursorKeys();
        
        EventBus.emit('current-scene-ready', this);
    }
    
    update(time: number, delta: number)
    {
        if (this.cursors.up.isDown)
        {
            this.player.y -= 10;
        }
        else if (this.cursors.down.isDown)
        {
            this.player.y += 10;
        }
        else if (this.cursors.left.isDown)
        {
            this.player.x -= 10;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.x += 10;
        }

    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}