import { EventBus } from '../EventBus';
import Player from "../objects/Player";
import Vector2 = Phaser.Math.Vector2;
import Background from "../objects/Background.ts";
import {GameObjects} from "phaser";
import StaticGroup = Phaser.Physics.Arcade.StaticGroup;

type AttractedTo = { attractionSprite: GameObjects.Sprite, distance: number }; 

export class Space extends Phaser.Scene
{
    isGodMod: boolean;
    private player: Player;
    private background: Background;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerPositionText: Phaser.GameObjects.Text;
    private gameOverText: Phaser.GameObjects.Text;
    attractedTo: AttractedTo | null = null;
    private isGameOver: boolean;
    planets: StaticGroup;
    
    constructor() {
        super('Space');
    }
    
    toggleGodMod() {
        this.isGodMod = !this.isGodMod;
        this.physics.world.drawDebug =  !this.physics.world.drawDebug;
        if (!this.physics.world.drawDebug) {
            this.physics.world.debugGraphic.clear()
        }
    }

    spawnPlanet(posX: number, posY: number, radius: number) {
        const spawnCoordinates: Vector2 = new Phaser.Math.Vector2(posX, posY);

        let planet = this.planets.create(
            spawnCoordinates.x,
            spawnCoordinates.y,
            'planet' + Phaser.Math.Between(1, 4)
        );
        planet.setCircle(radius / 2);
        planet.displayWidth = radius;
        planet.displayHeight = radius;

        const attractionCircleRadius: number = radius * 3;
        let attractionSprite = this.physics.add.sprite(
            spawnCoordinates.x,
            spawnCoordinates.y,
            'planet-attraction-aura'
        ).setAlpha(0.4);
        attractionSprite.setCircle(attractionSprite.texture.source[0].width / 2);
        attractionSprite.displayWidth = attractionCircleRadius;
        attractionSprite.displayHeight = attractionCircleRadius;

        this.physics.add.overlap(this.player, attractionSprite, this.overlapCallback, undefined, this);
        this.physics.add.collider(this.planets, this.player, this.collisionCallback, undefined, this);

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
        this.physics.world.drawDebug = false;
        
        this.isGameOver = false;
        // Init Music
        this.sound.play('lewis-hamilton-project', { loop: true });
        
        // Init Background
        this.background = new Background(this);
        
        this.cursors = this.input.keyboard!.createCursorKeys();
        
        // Zoom
        this.input.keyboard!.on('keydown-W', this.unzoom, this);
        this.input.keyboard!.on('keydown-S', this.zoom, this);


        // Init player
        this.player = new Player(this, 400, 300, 'ship');
        this.cameras.main.startFollow(this.player);

        const screenCenterX = 24;
        const screenCenterY = this.cameras.main.height - 120;
        this.gameOverText = this.add.text(screenCenterX, screenCenterY, ['No oxygen left.','Press SPACE to retry'], { font: '48px dimitri', color: '#C70039', stroke: '#ffffff', strokeThickness: 2, align: 'justify' }).setOrigin(0).setScrollFactor(0).setVisible(false);
        this.playerPositionText = this.add.text(10, 10, '', { font: '16px dimitri', color: '#ffffff' }).setScrollFactor(0);

        // Init planets
        this.planets = this.physics.add.staticGroup();
        this.spawnPlanet(1000, 1000, 100);
        this.spawnPlanet(1600, 1000, 200);
        this.spawnPlanet(1600, 1600, 300);

        const hudElements: [GameObjects.GameObject] =
            [
                this.player.inventoryHUD, 
                this.playerPositionText,
            ];
        let hudCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height);
        hudCamera.setScroll(0, 0);
        hudCamera.ignore(this.children.list.filter(child => 
                !hudElements.includes(child)
            )
        );
        this.cameras.main.ignore(this.children.list.filter(child => hudElements.includes(child)));

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
        this.background.update(delta);
        this.player.update(time, delta);
        this.player.oxygenTank.setPosition(this.player.x - 26, this.player.y - 30);
        if (!this.isGodMod) {
            this.updatePhysics(time, delta);
            this.checkOxygenLevels();
            if (this.isGameOver && this.cursors.space.isDown) {
                this.scene.start('Space');
            }
            if (this.isGameOver) {
                if (time % 1000 < 500) {
                    this.gameOverText.setVisible(true);
                } else {
                    this.gameOverText.setVisible(false);
                }
            }
        } else {
            this.updateGodModPhysics(time, delta)
        }
        
        // this.cameras.main.ignore(this.playerPositionText);
        this.playerPositionText.setText(
            `Position: (${this.player.x.toFixed(0)}, ${this.player.y.toFixed(0)}) Speed: ${this.player.body.velocity.length().toFixed(0)}`
        );

    }

    private restart() {
        console.log('Restart');
        this.sound.stopAll();
        this.scene.start('Space');
    }

    collisionCallback()
    {
        console.log('Bomboclat');
        this.player.oxygenTank.setOxygen(100);
    }
    
    updatePhysics(time: number, delta: number) {
        const delta_seconds: number = delta / 1000.0;

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.sound.play('reactor', { volume: 0.5, loop: true });
        }
        // Oxygen is always consumed by breathing
        this.player.oxygenTank.consumeOxygen(this.player.oxygenBreathConsumptionBySecond * delta_seconds);
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
            this.sound.stopByKey('reactor');
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
    
    updateGodModPhysics(time: number, delta: number) {
        this.player.setVelocity(0);
        const speed: number = 30;
        if (this.cursors.up.isDown) {
            this.player.y -= speed;
        }
        if (this.cursors.down.isDown) {
            this.player.y += speed;
        }
        if (this.cursors.left.isDown) {
            this.player.x -= speed;
        }
        if (this.cursors.right.isDown) {
            this.player.x += speed;
        }
    }

    private accelerateToPlanet() {
        this.player.setAcceleration(0);
        if (this.attractedTo) {
            this.physics.accelerateToObject(this.player, this.attractedTo.attractionSprite, (this.attractedTo.attractionSprite.displayWidth / this.attractedTo.distance) * 32);
        }
    }
    
    zoom()
    {
        // Handle it properly
        this.tweens.add({
            targets: this.cameras.main, // The camera we want to affect
            zoom: 1, // The target zoom level
            duration: 1000, // Duration of the tween in milliseconds
            ease: 'Sine.easeInOut', // Easing function for smooth animation
            yoyo: false, // If true, the tween will play in reverse after reaching the target value
            repeat: 0 // Number of times the tween should repeat (0 means it will play once)
        });
    }

    unzoom()
    {
        // if is on planet
        this.tweens.add({
            targets: this.cameras.main, // The camera we want to affect
            zoom: 0.1, // The target zoom level
            duration: 1000, // Duration of the tween in milliseconds
            ease: 'Sine.easeInOut', // Easing function for smooth animation
            yoyo: false, // If true, the tween will play in reverse after reaching the target value
            repeat: 0 // Number of times the tween should repeat (0 means it will play once)
        });
    }

    changeScene () {
        this.restart()
    }
}