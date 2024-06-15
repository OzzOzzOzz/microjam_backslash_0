import { GameObjects, Scene } from 'phaser';
//import {EventBus} from "../EventBus.ts";

import { EventBus } from '../EventBus';

export class tmpPlanet extends Scene
{
    spaceBackground: GameObjects.Image;
    planetSprite: GameObjects.Image;

    preload ()
    {
        this.load.image('planet', 'https://static.vecteezy.com/system/resources/previews/013/519/073/original/pixel-art-fictional-planet-png.png');
    }
    
    constructor() {
        super('tmpPlanet');
    }

    create ()
    {
        this.spaceBackground = this.add.image(1080 / 2, 720 / 2, 'spaceBackground');
        EventBus.emit('current-scene-ready', this);
        this.spaceBackground.setScale(2)
        
        this.planetSprite = this.add.image(1080 / 2, 720 / 2, 'planet');
        this.planetSprite.setScale(0.15)
        

    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}