import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }
    
    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
        this.load.image('behindStars', 'assets/spaceBackground/behind_stars.png');
        this.load.image('middleStars', 'assets/spaceBackground/middle_stars.png');
        this.load.image('frontStars', 'assets/spaceBackground/front_stars.png');
        
        this.load.image('planet', 'assets/planet.png');
        this.load.image('planet-attraction-aura', 'assets/planet-attraction-aura.png');

        this.load.image('ship', 'assets/playerShip/ship_with_engine.png');
        this.load.spritesheet('thrusters', 'assets/playerShip/ship_thrusters.png', { frameWidth: 48, frameHeight: 48 });
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
