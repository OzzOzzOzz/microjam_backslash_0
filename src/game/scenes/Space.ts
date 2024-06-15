import { GameObjects } from 'phaser';
import { EventBus } from '../EventBus';
import Player from "../objects/Player";
import Planet from "../objects/Planet.ts";
import Vector2 = Phaser.Math.Vector2;

export class Space extends Phaser.Scene
{
    private player: Player;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private spaceBackgroundStars: {
        "behind": GameObjects.TileSprite,
        "middle": GameObjects.TileSprite,
        "front": GameObjects.TileSprite,
    };
    private playerPositionText: Phaser.GameObjects.Text;
    
    spaceBackground: GameObjects.Image;
    planets: Planet[] = [];


    preload()
    {
        this.load.image('ship', 'https://labs.phaser.io/assets/games/asteroids/ship.png');
    }
    
    constructor() {
        super('Space');
    }

    spawnPlanet()
    {
        const spawnCoord: Vector2 = new Phaser.Math.Vector2(200, 100);

        this.planets.push(new Planet(
            this, 
            spawnCoord.x, 
            spawnCoord.y,
            'planet'))

    }
    
    create()
    {
        this.spaceBackgroundStars = {
            "behind": this.add.tileSprite(
                0,
                0,
                this.physics.world.bounds.width,
                this.physics.world.bounds.height,
                'behindStars'
            ).setScrollFactor(0).setOrigin(0, 0),
            "middle": this.add.tileSprite(
                0,
                0,
                this.physics.world.bounds.width,
                this.physics.world.bounds.height,
                'middleStars'
            ).setScrollFactor(0).setOrigin(0, 0),
            "front": this.add.tileSprite(
                0,
                0,
                this.physics.world.bounds.width,
                this.physics.world.bounds.height,
                'frontStars'
            ).setScrollFactor(0).setOrigin(0, 0),
        };
        // Init planets
        this.spawnPlanet();
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
        
        const parallaxFactor = 0.5;
        const behindStarsFactor = 0.015;
        const middleStarsFactor = 0.01;
        const frontStarsFactor = 0.075;
        this.spaceBackgroundStars.behind.tilePositionX = this.cameras.main.scrollX * behindStarsFactor * parallaxFactor;
        this.spaceBackgroundStars.behind.tilePositionY = this.cameras.main.scrollY * behindStarsFactor * parallaxFactor;
        this.spaceBackgroundStars.middle.tilePositionX = this.cameras.main.scrollX * middleStarsFactor * parallaxFactor;
        this.spaceBackgroundStars.middle.tilePositionY = this.cameras.main.scrollY * middleStarsFactor * parallaxFactor;
        this.spaceBackgroundStars.front.tilePositionX = this.cameras.main.scrollX * frontStarsFactor * parallaxFactor;
        this.spaceBackgroundStars.front.tilePositionY = this.cameras.main.scrollY * frontStarsFactor * parallaxFactor;
        
        this.playerPositionText.setText(
            `Position: (${this.player.x.toFixed(2)}, ${this.player.y.toFixed(2)})`
        );
    }

    changeScene ()
    {
        this.scene.start('Space');
        //console.log(this.sys.game.scene.scenes)
    }
}