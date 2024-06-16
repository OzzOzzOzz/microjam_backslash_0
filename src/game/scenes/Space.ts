import { EventBus } from '../EventBus';
import Player from "../objects/Player";
import Planet from "../objects/Planet.ts";
import Vector2 = Phaser.Math.Vector2;
import Background from "../objects/Background.ts";
import {GameObjects} from "phaser";
import TextStyle = Phaser.GameObjects.TextStyle;

type AttractedTo = { attractionSprite: GameObjects.Sprite, distance: number }; 

export class Space extends Phaser.Scene
{
    private player: Player;
    private background: Background;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerPositionText: Phaser.GameObjects.Text;
    private gameOverText: Phaser.GameObjects.Text;
    attractedTo: AttractedTo | null = null;
    singlePlanet: Planet;
    private isGameOver: boolean;
    
    constructor() {
        super('Space');
    }

    spawnPlanet()
    {
        const spawnCoordinates: Vector2 = new Phaser.Math.Vector2(200, 300);

        console.log('planet' + Phaser.Math.Between(1, 4));
        this.singlePlanet = new Planet(
            this, 
            spawnCoordinates.x, 
            spawnCoordinates.y,
            'planet' + Phaser.Math.Between(1, 4),
            100);
        
        this.physics.add.overlap(this.player, this.singlePlanet.attractionSprite);
        this.physics.world.on('overlap', (player: Player, attractionSprite: GameObjects.Sprite) => {
            this.attractedTo = { attractionSprite: attractionSprite, distance: Phaser.Math.Distance.Between(player.x, player.y, attractionSprite.x, attractionSprite.y) };
        })
        this.physics.add.collider(this.singlePlanet, this.player, this.collisionCallback)
    }
    
    create()
    {
        this.isGameOver = false;
        
        // Init Background
        this.background = new Background(this);
        
        // Init player
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.player = new Player(this, 400, 300, 'ship');
        this.cameras.main.startFollow(this.player);

        const screenCenterX = 24;
        const screenCenterY = this.cameras.main.height - 120;
        this.gameOverText = this.add.text(screenCenterX, screenCenterY, ['No oxygen left.','Press SPACE to retry'], { font: '48px dimitri', color: '#C70039', stroke: '#ffffff', strokeThickness: 2, align: 'justify' }).setOrigin(0).setScrollFactor(0).setVisible(false);
        this.playerPositionText = this.add.text(10, 10, '', { font: '16px dimitri', color: '#ffffff' }).setScrollFactor(0);

        // Init planets
        this.spawnPlanet();
        
        EventBus.emit('current-scene-ready', this);
    }


    checkOxygenLevels() {
        if (this.player.oxygenTank.isEmpty()) {
            console.log('coucou')
            this.isGameOver = true;
            this.gameOverText.setVisible(true);
        }
    }
    
    update(time: number, delta: number)
    {
        this.checkOxygenLevels();
        if (this.cursors.space.isDown) {
            this.scene.start('Space');
        }
        this.background.update(delta);
        this.player.update(time, delta);
        this.updatePhysics(time, delta);

        if (this.isGameOver) {
            if (time % 1000 < 500) {
                this.gameOverText.setVisible(true);
            } else {
                this.gameOverText.setVisible(false);
            }
        }
        this.playerPositionText.setText(
            `Position: (${this.player.x.toFixed(2)}, ${this.player.y.toFixed(2)})`
        );
    }
    
    collisionCallback()
    {
        console.log('Bomboclat');
    }
    
    updatePhysics(time: number, delta: number) {
        const delta_seconds: number = delta / 1000.0;

        if (this.cursors.up.isDown) {
            if (!this.player.oxygenTank.isEmpty()) {
                this.player.oxygenTank.consumeOxygen(this.player.oxygenBurstConsumptionBySecond * delta_seconds);
                this.physics.velocityFromRotation(this.player.rotation, 200, this.player.body!.acceleration);
                this.player.thrusters.anims.play("burst", true);
                this.player.thrusters.setVisible(true);
            } else {
                this.accelerateToPlanet();
            }
        } else {
            this.accelerateToPlanet();
        }

        if (this.attractedTo && !Phaser.Geom.Intersects.RectangleToRectangle(this.attractedTo.attractionSprite.getBounds(), this.player.getBounds())) {
            this.attractedTo = null;
        }

        if (this.cursors.up.isUp) {
            if (this.player.thrusters.anims.isPlaying) {
                this.player.thrusters.anims.stop();
                this.player.thrusters.setVisible(false);
            }
        }

        //PLAYER PHYSICS
        if (this.cursors.left.isDown) {
            this.player.setAngularVelocity(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setAngularVelocity(300);
        } else {
            this.player.setAngularVelocity(0);
        }
    }

    private accelerateToPlanet() {
        this.player.setAcceleration(0);
        if (this.attractedTo) {
            this.physics.accelerateToObject(this.player, this.attractedTo.attractionSprite, (this.attractedTo.attractionSprite.displayWidth - this.attractedTo.distance) * 0.5);
        }
    }

    changeScene () {
        this.scene.start('Space');
    }
}