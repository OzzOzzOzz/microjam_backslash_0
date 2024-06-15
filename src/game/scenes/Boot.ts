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
        this.load.image('behindStars', 'assets/spaceBackground/stars_1.png');
        this.load.image('middleStars', 'assets/spaceBackground/stars_2.png');
        this.load.image('frontStars', 'assets/spaceBackground/stars_3.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
