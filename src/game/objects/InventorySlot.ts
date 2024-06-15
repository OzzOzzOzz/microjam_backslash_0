import Phaser from 'phaser';

export default class InventorySlot extends Phaser.GameObjects.Container {
    private slot: Phaser.GameObjects.Rectangle;
    private itemImage: Phaser.GameObjects.Image | null;

    constructor(scene: Phaser.Scene, x: number, y: number, size: number) {
        super(scene, x, y);

        // Create a slot background
        this.slot = scene.add.rectangle(0, 0, size, size, 0x000000).setStrokeStyle(2, 0xffffff);
        this.add(this.slot);

        // Item image initially null
        this.itemImage = null;

        scene.add.existing(this);
    }

    addItem(texture: string) {
        // If there's already an item, remove it
        if (this.itemImage) {
            this.itemImage.destroy();
        }

        // Add the new item image
        this.itemImage = this.scene.add.image(0, 0, texture);
        this.itemImage.setDisplaySize(this.slot.width * 0.8, this.slot.height * 0.8);
        this.add(this.itemImage);
    }

    clearItem() {
        if (this.itemImage) {
            this.itemImage.destroy();
            this.itemImage = null;
        }
    }
}
