import { EventBus } from '../EventBus';
import Player from "../objects/Player";
import Planet from "../objects/Planet.ts";
import Vector2 = Phaser.Math.Vector2;
import Background from "../objects/Background.ts";

export class Space extends Phaser.Scene
{
    private player: Player;
    private background: Background;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerPositionText: Phaser.GameObjects.Text;
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
        const spawnCoordinates: Vector2 = new Phaser.Math.Vector2(200, 100);

        this.planets.push(new Planet(
            this, 
            spawnCoordinates.x, 
            spawnCoordinates.y,
            'planet'));
    }
    
    create()
    {
        // Init Background
        this.background = new Background(this);
        
        // Init planets
        this.spawnPlanet();
        
        // Init player
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.player = new Player(this, 400, 300, 'ship', this.cursors);
        this.cameras.main.startFollow(this.player);

        this.playerPositionText = this.add.text(10, 10, '', { font: '16px Courier', color: '#ffffff' });
        // Ensure the text stays in the same place on the screen
        this.playerPositionText.setScrollFactor(0);

        EventBus.emit('current-scene-ready', this);
    }
    
    update(time: number, delta: number)
    {
        this.background.update(delta);
        this.player.update(time, delta);
        
        this.playerPositionText.setText(
            `Position: (${this.player.x.toFixed(2)}, ${this.player.y.toFixed(2)})`
        );
    }

    changeScene ()
    {
        this.scene.start('Space');
    }
}