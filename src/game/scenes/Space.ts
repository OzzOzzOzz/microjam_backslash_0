import { EventBus } from '../EventBus';
import Player from "../objects/Player";
import Vector2 = Phaser.Math.Vector2;
import Background from "../objects/Background.ts";
import {GameObjects} from "phaser";
import StaticGroup = Phaser.Physics.Arcade.StaticGroup;

type AttractedTo = { attractionSprite: GameObjects.Sprite, distance: number }; 

export class Space extends Phaser.Scene {
    isGodMod: boolean;
    planetCreationType: number;
    resourceCreationType: number;
    private player: Player;
    private background: Background;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private playerPositionText: Phaser.GameObjects.Text;
    private gameOverText: Phaser.GameObjects.Text;
    attractedTo: AttractedTo | null = null;
    private isGameOver: boolean;
    planets: StaticGroup;
    private hudCamera: Phaser.Cameras.Scene2D.Camera;
    private planetRefResource1: GameObjects.GameObject;
    private planetRefResource2: GameObjects.GameObject;
    private planetRefResource3: GameObjects.GameObject;

    constructor() {
        super('Space');
    }

    toggleGodMod() {
        this.isGodMod = !this.isGodMod;
        this.physics.world.drawDebug = !this.physics.world.drawDebug;
        if (!this.physics.world.drawDebug) {
            this.physics.world.debugGraphic.clear()
        }
    }

    spawnSpecificPlanet(posX: number, posY: number, type: number, resourceType: number) {
        let radius: number = 125;
        if (type === 1) {
            radius = 125;
        } else if (type === 2) {
            radius = 200;
        } else if (type === 3) {
            radius = 300;
        }
        const planetRef = this.spawnPlanet(posX, posY, radius);
        this.setPlanetResource(resourceType, planetRef);
    }

    private setPlanetResource(resourceType: number, planetRef) {
        if (resourceType != -1) {
            if (resourceType == 0) {
                this.planetRefResource1 = planetRef;
            }
            if (resourceType == 1) {
                this.planetRefResource2 = planetRef;
            }
            if (resourceType == 2) {
                this.planetRefResource3 = planetRef;
            }
        }
    }

    changePlanetCreationType(newType: number) {
        this.planetCreationType = newType;
    }
    
    changeResourceCreationType(newType: number) {
        this.resourceCreationType = newType;
    }

    onClickCallback() {
        if (!this.isGodMod) {
            return;
        }
        const coordinates = {
            x: this.input.activePointer.worldX,
            y: this.input.activePointer.worldY,
        };
        this.spawnSpecificPlanet(coordinates.x, coordinates.y, this.planetCreationType, this.resourceCreationType);
    }
    
    getResourceIndex(planet)
    {
        if (this.planetRefResource1 == planet)
        {
            return 0;
        }
        if (this.planetRefResource2 == planet)
        {
            return 1;
        }
        if (this.planetRefResource3 == planet)
        {
            return 2;
        }
        return -1;
    }

    downloadMap() {
        const planetMap = this.planets.getChildren().map((planet) => {
            return {
                position: {
                    x: planet!.body!.position.x + planet!.body!.radius,
                    y: planet!.body!.position.y + planet!.body!.radius
                },
                radius: planet!.body!.radius * 2,
                resourceIndex: this.getResourceIndex(planet)
            };
        })
        const map = {
            planets: planetMap
        };
        const blob = new Blob([JSON.stringify(map, null, 2)], {type: 'application/json'})
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = "map";
        link.click();
        URL.revokeObjectURL(link.href);
    }

    loadMap() {
        this.planets = this.physics.add.staticGroup();

        const mapData = this.cache.json.get('map');
        mapData.planets.forEach(planetJson =>
            {
                const planet = this.spawnPlanet(
                    planetJson.position.x,
                    planetJson.position.y,
                    planetJson.radius
                );
                this.setPlanetResource(planetJson.resourceIndex, planet);
            }
        );
        
        // this.shipPart1 = this.add.sprite(50, 50, 'shipPart1').setOrigin(0.5).setScrollFactor(0);
        // this.shipPart1.scale = 1.5;
        // this.shipPart1.postFX.addShine(2, 0.5, 1.5);
        // this.shipPart2 = this.add.sprite(150, 150, 'shipPart2').setOrigin(0.5).setScrollFactor(0);
        // this.shipPart2.scale = 1.5;
        // this.shipPart2.postFX.addShine(2, 0.5, 1.5);
        // this.shipPart3 = this.add.sprite(300, 300, 'shipPart3').setOrigin(0.5).setScrollFactor(0);
        // this.shipPart3.scale = 1.5;
        // this.shipPart3.postFX.addShine(2, 0.5, 1.5);
    }

    spawnPlanet(posX: number, posY: number, radius: number) {
        const spawnCoordinates: Vector2 = new Phaser.Math.Vector2(posX, posY);

        let planet = this.planets.create(
            spawnCoordinates.x,
            spawnCoordinates.y,
            'planet' + Phaser.Math.Between(1, 4)
        );
        planet.setOrigin(0.5);
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
        this.physics.add.collider(this.planets, this.player, this.collisionCallback, this.crashCallback, this);

        this.planets.refresh();

        this.hudCamera.ignore(planet);
        this.hudCamera.ignore(attractionSprite);
        
        return planet;
    }

    overlapCallback(player, planet) {
        this.attractedTo = {
            attractionSprite: planet,
            distance: Phaser.Math.Distance.Between(player.x, player.y, planet.x, planet.y)
        };
    }
    
    create()
    {
        if (!this.isGodMod) {
            this.physics.world.drawDebug = false;
        }
        // Default planet creation type (size)
        this.planetCreationType = 1;
        
        // No resource by default
        this.resourceCreationType = -1;
        
        // Click event listener for godmod planet creation
        this.input.on('pointerdown', this.onClickCallback, this);
        
        this.isGameOver = false;
        // Init Music
        this.sound.play('lewis-hamilton-project', { loop: true });
        
        // Init Background
        this.background = new Background(this);
        
        this.cursors = this.input.keyboard!.createCursorKeys();
        
        // Zoom
        this.input.keyboard!.on('keydown-W', this.unZoom, this);
        this.input.keyboard!.on('keydown-S', this.zoom, this);
        
        // Init player
        this.player = new Player(this, 400, 300, 'ship');
        this.cameras.main.startFollow(this.player);

        const screenCenterX = 24;
        const screenCenterY = this.cameras.main.height - 120;
        this.gameOverText = this.add.text(screenCenterX, screenCenterY, ['No fuel left.','Press SPACE to retry'], { font: '48px dimitri', color: '#C70039', stroke: '#ffffff', strokeThickness: 2, align: 'justify' }).setOrigin(0).setScrollFactor(0).setVisible(false);
        this.playerPositionText = this.add.text(10, 10, '', { font: '16px dimitri', color: '#ffffff' }).setScrollFactor(0);

        const hudElements: [GameObjects.GameObject] =
            [
                this.player.inventoryHUD, 
                this.playerPositionText,
            ];
        this.hudCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height);
        this.hudCamera.setScroll(0, 0);
        this.hudCamera.ignore(this.children.list.filter(child => 
                !hudElements.includes(child)
            )
        );
        this.cameras.main.ignore(this.children.list.filter(child =>
                hudElements.includes(child)
            )
        );

        // Init planets
        this.loadMap();
        EventBus.emit('current-scene-ready', this);
    }


    checkOxygenLevels() {
        if (this.player.oxygenTank.isEmpty()) {
            if (!this.isGameOver) {
                this.isGameOver = true;
                this.gameOverText.setVisible(true);
            }
        } else {
            if (this.isGameOver) {
                this.isGameOver = false;
                this.gameOverText.setVisible(false);
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
                this.restart()
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
        this.sound.stopAll();
        this.scene.start('Space');
    }

    crashCallback() :boolean
    {
        
        
        let planetRadius = this.attractedTo?.attractionSprite.displayWidth;
        let planetPos = new Vector2(
            this.attractedTo?.attractionSprite.body?.position.x + (planetRadius / 2),
            this.attractedTo?.attractionSprite.body?.position.y + (planetRadius / 2)
        );
        
        let playerRadius = this.player.displayWidth;
        let playerPos =  new Vector2(
            this.player.body.position.x + playerRadius / 2,
            this.player.body.position.y + playerRadius / 2
        );
        let playerRotationVec = new Vector2(
            Math.cos(this.player.rotation),
            Math.sin(this.player.rotation)
        )
        
        let player2PlanetVec = planetPos.subtract(playerPos)
        
        // const graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});
        // const rect = new Phaser.Geom.Rectangle(playerPos.x, playerPos.y, player2PlanetVec.x, player2PlanetVec.y);
        // graphics.strokeRectShape(rect);
       
        // console.log(playerRotationVec.normalize().dot(player2PlanetVec.normalize()))
        // if(this.player.body.velocity.length() > 300) {
        //     console.log("yo")
        // }
        if (playerRotationVec.normalize().dot(player2PlanetVec.normalize()) > -0.7) {
            console.log("OUYAAA")
            return true;
        }
        return true;
        
    }
    
    collisionCallback()
    {
        this.player.oxygenTank.setOxygen(100);
    }
    
    updatePhysics(time: number, delta: number) {
        const delta_seconds: number = delta / 1000.0;

        if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && !this.player.oxygenTank.isEmpty()) {
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

    unZoom()
    {
        // if is on planet
        this.tweens.add({
            targets: this.cameras.main, // The camera we want to affect
            zoom: 0.2, // The target zoom level
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