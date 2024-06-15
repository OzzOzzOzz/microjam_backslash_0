import { EventBus } from '../EventBus';
import Player from "../objects/Player";
import Planet from "../objects/Planet.ts";
import Vector2 = Phaser.Math.Vector2;
import Background from "../objects/Background.ts";
import {GameObjects} from "phaser";

type AttractedTo = { attractionSprite: GameObjects.Sprite, distance: number }; 

export class Space extends Phaser.Scene
{
    private player: Player;
    private background: Background;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerPositionText: Phaser.GameObjects.Text;
    attractedTo: AttractedTo | null = null;
    singlePlanet: Planet;
    
    preload()
    {
        this.load.image('ship', 'https://labs.phaser.io/assets/games/asteroids/ship.png');
    }
    
    constructor() {
        super('Space');
    }

    spawnPlanet()
    {
        const spawnCoordinates: Vector2 = new Phaser.Math.Vector2(1000, 1000);

        this.singlePlanet = new Planet(
            this, 
            spawnCoordinates.x, 
            spawnCoordinates.y,
            'planet',
            200);
        
        this.physics.add.overlap(this.player, this.singlePlanet.attractionSprite);
        this.physics.world.on('overlap', (player: Player, attractionSprite: GameObjects.Sprite) => {
            this.attractedTo = { attractionSprite: attractionSprite, distance: Phaser.Math.Distance.Between(player.x, player.y, attractionSprite.x, attractionSprite.y) };
        })
        
        this.physics.add.collider(this.singlePlanet, this.player, this.collisionCallback)

    }
    
    create()
    {
        // Init Background
        this.background = new Background(this);
        
        // Init player
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.player = new Player(this, 400, 300, 'ship');
        this.cameras.main.startFollow(this.player);

        this.playerPositionText = this.add.text(10, 10, '', { font: '16px Courier', color: '#ffffff' });
        // Ensure the text stays in the same place on the screen
        this.playerPositionText.setScrollFactor(0);

        // Init planets
        this.spawnPlanet();
        
        EventBus.emit('current-scene-ready', this);
    }
    
    update(time: number, delta: number)
    {
        this.background.update(delta);
        this.player.update(time, delta);
        this.updatePhysics(time, delta);
        
        this.playerPositionText.setText(
            `Position: (${this.player.x.toFixed(2)}, ${this.player.y.toFixed(2)})`
        );
    }
    
    collisionCallback()
    {
        console.log('Bomboclat');
    }
    
    updatePhysics(time: number, delta: number) 
    {
        const delta_seconds: number = delta / 1000.0;


        if (this.cursors.up.isDown)
        {
            if (!this.player.oxygenTank.isEmpty())
            {
                this.player.oxygenTank.consumeOxygen(this.player.oxygenBurstConsumptionBySecond * delta_seconds);
                this.physics.velocityFromRotation(this.player.rotation, 200, this.player.body!.acceleration);
            }
            else
            {
                this.accelerateToPlanet();
            }
        }
        else 
        {
            this.accelerateToPlanet();
        }

        if (this.attractedTo && !Phaser.Geom.Intersects.RectangleToRectangle(this.attractedTo.attractionSprite.getBounds(), this.player.getBounds())) {
            this.attractedTo = null;
        }
        
        //PLAYER PHYSICS
        if (this.cursors.left.isDown)
        {
            this.player.setAngularVelocity(-300);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setAngularVelocity(300);
        }
        else
        {
            this.player.setAngularVelocity(0);
        }
    }

    private accelerateToPlanet() {
        this.player.setAcceleration(0);
        if (this.attractedTo) {
            this.physics.accelerateToObject(this.player, this.attractedTo.attractionSprite, (this.attractedTo.attractionSprite.displayWidth - this.attractedTo.distance) * 0.3);
        }
    }

    changeScene ()
    {
        this.scene.start('Space');
    }
}