class GameOver extends Phaser.Scene {
    constructor() {
        super('gameoverScene');
        this.audioplaying = false;
    }

    preload() {
        this.load.path = './assets/';
        this.load.bitmapFont('BC', 'BC.png', 'BC.xml');
        this.load.audio('building', ['Build3.mp3']);
        this.load.image('gameoverback', 'Gameover.png')

    }

    create(){
        this.add.image(centerX,centerY,'gameoverback')
        let title01 = this.add.bitmapText(centerX, centerY, 'BC', 'Game Over!', 32).setOrigin(0.5).setTintFill(0xffffff);
        let goPlay= this.add.bitmapText(centerX, centerY+50, 'BC', 'Play Again', 16).setOrigin(0.5).setTintFill(0xffffff).setInteractive();
        let goBack = this.add.bitmapText(centerX, centerY+100, 'BC', 'Title Screen', 16).setOrigin(0.5).setTintFill(0xffffff).setInteractive();

        goPlay.on('pointerdown', () => {
            goBack.setTint(0x00ff00);  
            this.scene.restart('PlayScene')
            this.scene.start('PlayScene');
        });


        goBack.on('pointerdown', () => {
            goBack.setTint(0x00ff00);  
            this.scene.start('titleScene');
        });


    }
   
}