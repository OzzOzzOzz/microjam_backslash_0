import Phaser, {GameObjects} from 'phaser';
import OxygenTank from "./OxygenTank";
import AnimationState = Phaser.Animations.AnimationState;

export default class Player extends Phaser.Physics.Arcade.Sprite {

    oxygenTank: OxygenTank;
    oxygenBreathConsumptionBySecond: number;
    oxygenBurstConsumptionBySecond: number;
    engine: GameObjects.Sprite;
    thrusters: GameObjects.Sprite;
    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setMaxVelocity(200);
        
        this.oxygenTank = new OxygenTank(this.scene, this.x, this.y, 100);
        this.oxygenBreathConsumptionBySecond = 1.0;
        this.oxygenBurstConsumptionBySecond = 10.0;
        this.oxygenTank.depth = 1;
        
        this.depth = 2;
        
        const spriteScaleFactor = 2;
        this.scale = spriteScaleFactor;
        
        this.engine = this.scene.add.sprite(x, y, 'engine');
        this.engine.scale = spriteScaleFactor;
        this.engine.depth = 1;
        
        this.thrusters = this.scene.add.sprite(x, y, 'thrusters');
        this.thrusters.setVisible(false);
        this.thrusters.scale = spriteScaleFactor;
        this.thrusters.anims = new AnimationState(this.thrusters);
        this.thrusters.anims.create({
            key: "burst",
            frameRate: 7,
            frames: this.anims.generateFrameNumbers("thrusters", {
                start: 1,
                end: 8,
            }),
            repeat: -1
        })
        this.thrusters.anims.showOnStart = true;
        this.engine.depth = 1;
    }
    
    protected preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        const rotation = this.rotation;
        const enginePosition = {
            "x": this.x,
            "y": this.y,
        }
        this.engine.setRotation(rotation);
        this.engine.setPosition(enginePosition.x, enginePosition.y);
        if (this.thrusters.anims.isPlaying) {
            const thrustersPosition = {
                "x": this.x,
                "y": this.y
            }
            this.thrusters.setRotation(rotation);
            this.thrusters.setPosition(thrustersPosition.x, thrustersPosition.y);
        }
    }

    update (time: number, delta: number)
    {
        const delta_seconds: number = delta / 1000.0;
        
        // Oxygen is always consumed by breathing
        this.oxygenTank.consumeOxygen(this.oxygenBreathConsumptionBySecond * delta_seconds);
        this.oxygenTank.setPosition(this.x - 26, this.y - 30);
    }
}