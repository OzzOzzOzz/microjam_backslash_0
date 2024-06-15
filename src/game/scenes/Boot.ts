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
        this.load.image('planet', 'https://static.vecteezy.com/system/resources/previews/013/519/073/original/pixel-art-fictional-planet-png.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
