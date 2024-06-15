import { GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import Player from "../objects/Player";

export class Space extends Phaser.Scene
{
    private player: Player;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    spaceBackgroundStars: {
        "behind": GameObjects.Image,
        "middle": GameObjects.Image,
        "front": GameObjects.Image,
    };
    camera: Phaser.Cameras.Scene2D.Camera;

    preload()
    {
        this.load.image('ship', 'https://labs.phaser.io/assets/games/asteroids/ship.png');
    }
    
    constructor() {
        super('Space');
    }

    create()
    {
        // Init camera
        this.camera = this.cameras.main;
        
        // Init space background images
        const screenHeight: number = this.sys.game.config.height as number;
        const screenWidth: number = this.sys.game.config.width as number;
        this.spaceBackgroundStars = {
            "behind": this.add.image(
                screenWidth / 2,
                screenHeight / 2,
                'behindStars'
            ),
            "middle": this.add.image(
                screenWidth / 2,
                screenHeight / 2,
                'middleStars'
            ),
            "front": this.add.image(
                screenWidth / 2,
                screenHeight / 2,
                'frontStars'
            ),
        };

        // Init player
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.player = new Player(this, 400, 300, 'ship', this.cursors);
        this.cameras.main.startFollow(this.player);

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