import Phaser from 'phaser';
import InventorySlot from './InventorySlot';

export default class InventoryHUD extends Phaser.GameObjects.Container {
    private slots: InventorySlot[];

    constructor(scene: Phaser.Scene, x: number, y: number, slotCount: number, slotSize: number, spacing: number) {
        super(scene, x, y);

        this.slots = [];

        for (let i = 0; i < slotCount; i++) {
            const slot = new InventorySlot(scene, i * (slotSize + spacing), 0, slotSize);
            this.slots.push(slot);
            this.add(slot);
        }

        scene.add.existing(this);
    }

    addItemToSlot(slotIndex: number, texture: string) {
        if (slotIndex >= 0 && slotIndex < this.slots.length) {
            this.slots[slotIndex].addItem(texture);
        }
    }

    clearSlot(slotIndex: number) {
        if (slotIndex >= 0 && slotIndex < this.slots.length) {
            this.slots[slotIndex].clearItem();
        }
    }
}
