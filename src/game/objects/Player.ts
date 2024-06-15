import Phaser, {GameObjects} from 'phaser';
import OxygenTank from "./OxygenTank";
import AnimationState = Phaser.Animations.AnimationState;
import InventoryHUD from "./InventoryHUD.ts";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private inventoryHUD: InventoryHUD;
    oxygenTank: OxygenTank;
    oxygenBreathConsumptionBySecond: number;
    oxygenBurstConsumptionBySecond: number;
    thrusters: GameObjects.Sprite;
    
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setMaxVelocity(200);
        this.body!.onOverlap = true;
        
        // Change player z-index
        this.depth = 2;
        
        this.oxygenTank = new OxygenTank(this.scene, this.x, this.y, 100);
        // this.oxygenBreathConsumptionBySecond = 1.0;
        // this.oxygenBurstConsumptionBySecond = 10.0;
        this.oxygenBreathConsumptionBySecond = 0;
        this.oxygenBurstConsumptionBySecond = 0;
        this.oxygenTank.depth = 1;

        this.inventoryHUD = new InventoryHUD(scene, 30, 55, 3, 40, 10);
        this.inventoryHUD.setScrollFactor(0);
        this.inventoryHUD.addItemToSlot(0, 'ship');
        
        const spriteScaleFactor = 1.5;
        this.scale = spriteScaleFactor;
        
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
    }
    
    protected preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
        const rotation = this.rotation;
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