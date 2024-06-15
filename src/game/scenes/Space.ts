import { GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import Player from "../objects/Player";

export class Space extends Phaser.Scene
{
    private player: Player;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private spaceBackgroundStars: {
        "behind": GameObjects.Image,
        "middle": GameObjects.Image,
        "front": GameObjects.Image,
    };
    private camera: Phaser.Cameras.Scene2D.Camera;
    private playerPositionText: Phaser.GameObjects.Text;
    
    preload()
    {
        this.load.image('ship', 'https://labs.phaser.io/assets/games/asteroids/ship.png');
    }
    
    constructor() {
        super('Space');
    }

    create()
    {
        const worldWidth = 2000;
        const worldHeight = 2000;
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

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

        this.playerPositionText = this.add.text(10, 10, '', { font: '16px Courier', color: '#ffffff' });
        this.playerPositionText.setScrollFactor(0); // Ensure the text stays in the same place on the screen

        EventBus.emit('current-scene-ready', this);
    }
    
    update(time: number, delta: number)
    {
        this.player.update(time, delta);
        
        this.playerPositionText.setText(
            `Position: (${this.player.x.toFixed(2)}, ${this.player.y.toFixed(2)})`
        );
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}