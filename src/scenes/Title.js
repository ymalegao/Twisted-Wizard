class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
        this.audioplaying = false;
    }

    preload() {
        this.load.path = './assets/';
        this.load.bitmapFont('BC', 'BC.png', 'BC.xml');
        this.load.audio('building', ['Build3.mp3']);
        this.load.image('background', 'titlebackground.png');

    }

    create() {
        // this.time.delayedCall(2000, () => {
        //     this.showWaveText();
        // });
        this.add.image(centerX,centerY,'background');
        this.buildm = this.sound.add('building', {
            mute:false,
            volume:0.5,
            rate:1,
            loop:true
        });
        if (!this.audioplaying){
            this.buildm.play();
            this.audioplaying = true;
        }

       
        this.cameras.main.setBackgroundColor('#ffffff');
        let title01 = this.add.bitmapText(centerX+30, centerY-80, 'BC', 'Twisted Wizard', 45).setOrigin(0.5).setTintFill(0xffffff);
        // let title02 = this.add.bitmapText(centerX, centerY, 'BC', 'Twisted Wizard', 32).setOrigin(0.5).setTint(0xff00ff).setBlendMode('SCREEN');
        // let title03 = this.add.bitmapText(centerX, centerY, 'BC', 'Twisted Wizard', 32).setOrigin(0.5).setTint(0xffff00).setBlendMode('ADD');




        // this.add.bitmapText(centerX, centerY - 10 , 'BC', '', 24).setOrigin(0.5);
        let playText = this.add.bitmapText(centerX+30, centerY + 10, 'BC', 'Click to play', 32).setOrigin(0.5).setInteractive().setTintFill(0xffffff);
        let instructionText = this.add.bitmapText(centerX+30, centerY + 50, 'BC', 'Instructions', 24).setOrigin(0.5).setInteractive().setTintFill(0xffffff);

        playText.on('pointerdown', () => {
            playText.setTint(0x00ff00);  
            this.scene.start('PlayScene');
            this.buildm.stop()
        });

        instructionText.on('pointerdown', () => {
            instructionText.setTint(0x00ff00);  
            this.scene.start('instructionScene');
        });


    }
}
