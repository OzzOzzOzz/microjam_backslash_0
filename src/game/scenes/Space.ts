import { GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import Player from "../objects/Player";

export class Space extends Phaser.Scene
{
    private player: Player;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    spaceBackground: GameObjects.Image;
    
    preload()
    {
        this.load.image('ship', 'https://labs.phaser.io/assets/games/asteroids/ship.png');
    }
    
    constructor() {
        super('Space');
    }

    create()
    {
        const screenHeight: number = this.sys.game.config.height as number;
        const screenWidth: number = this.sys.game.config.width as number;
        this.spaceBackground = this.add.image(
            screenWidth / 2,
            screenHeight / 2,
            'spaceBackground'
        );
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.player = new Player(this, 400, 300, 'ship', this.cursors);
        
        EventBus.emit('current-scene-ready', this);
    }
    
    update(time: number, delta: number)
    {
        this.player.update(time, delta);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}