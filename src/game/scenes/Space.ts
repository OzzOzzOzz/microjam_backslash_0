import { EventBus } from '../EventBus';
import Player from "../objects/Player";
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
    private gameOverText: Phaser.GameObjects.Text;
    attractedTo: AttractedTo | null = null;
    private isGameOver: boolean;
    planets: Phaser.Physics.Arcade.StaticGroup;
    
    constructor() {
        super('Space');
    }

    spawnPlanet(posX: number, posY: number, radius: number)
    {
        const spawnCoordinates: Vector2 = new Phaser.Math.Vector2(posX, posY);
        
        let planet = this.planets.create(
            spawnCoordinates.x,
            spawnCoordinates.y,
            'planet' + Phaser.Math.Between(1, 4)
        );
        planet.setCircle(radius / 2);
        planet.displayWidth = radius;
        planet.displayHeight = radius;

        const attractionCircleRadius:number = radius * 3;
        let attractionSprite = this.physics.add.sprite(
            spawnCoordinates.x,
            spawnCoordinates.y, 
            'planet-attraction-aura'
        ).setAlpha(0.4);
        attractionSprite.setCircle(attractionSprite.texture.source[0].width / 2);
        attractionSprite.displayWidth = attractionCircleRadius;
        attractionSprite.displayHeight =  attractionCircleRadius;

        this.physics.add.overlap(this.player, attractionSprite, this.overlapCallback, undefined, this);
        this.physics.add.collider(this.planets, this.player, this.collisionCallback);
        
        this.planets.refresh();
    }

    overlapCallback(player, planet) {
        this.attractedTo = {
            attractionSprite: planet,
            distance: Phaser.Math.Distance.Between(player.x, player.y, planet.x, planet.y)
        };
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
        this.planets = this.physics.add.staticGroup();
        this.spawnPlanet(1000, 1000, 200);
        this.spawnPlanet(1600, 1000, 200);
        
        EventBus.emit('current-scene-ready', this);
    }


    checkOxygenLevels() {
        if (this.player.oxygenTank.isEmpty()) {
            if (!this.isGameOver) {
                this.isGameOver = true;
                this.gameOverText.setVisible(true);
            }
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
            `Position: (${this.player.x.toFixed(2)}, ${this.player.y.toFixed(2)}) Speed: ${this.player.body?.velocity.length()}`
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
            this.physics.accelerateToObject(this.player, this.attractedTo.attractionSprite, (this.attractedTo.attractionSprite.displayWidth / this.attractedTo.distance) * 16);
        }
    }

    changeScene () {
        this.scene.start('Space');
    }
}