import { GameObjects, Scene } from 'phaser';
import {EventBus} from "../EventBus.ts";

import { EventBus } from '../EventBus';

export class Space extends Scene
{
    spaceBackground: GameObjects.Image;


    constructor() {
        super('Space');
    }
    
    create ()
    {
          this.spaceBackground = this.add.image(1080 / 2, 720 / 2, 'spaceBackground');
        EventBus.emit('current-scene-ready', this);

    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}