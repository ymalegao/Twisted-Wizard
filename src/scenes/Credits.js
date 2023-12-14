class Credits extends Phaser.Scene {
    constructor() {
        super('creditsScene');
        this.audioplaying = false;
    }

    preload() {
        //load assets
        this.load.path = './assets/';
        this.load.bitmapFont('BC', 'BC.png', 'BC.xml');
        this.load.audio('building', ['Build3.mp3']);
        this.load.image('backgrounds', 'credits.png');

    }

    create() {
        //set cursor, add background, add sound
        this.input.setDefaultCursor('url(./assets/leftwand.cur), pointer');
        this.add.image(centerX, centerY, 'backgrounds');

        this.buildm = this.sound.add('building', {
            mute: false,
            volume: 0.5,
            rate: 1,
            loop: true
        });

        
        this.buildm.play();
       
        this.cameras.main.setBackgroundColor('#ffffff');

        let title01 = this.add.bitmapText(centerX, centerY - 60, 'BC', 'Twisted Wizard', 32).setOrigin(0.5).setTintFill(0xffffff);

        //game designer, artist, and music text
        let developerText = this.add.bitmapText(centerX, centerY-20, 'BC', 'Developed by:', 28).setOrigin(0.5).setTintFill(0xffffff);
        let gameDevText = this.add.bitmapText(centerX, centerY + 20, 'BC', '[Yash Malegaonkar] - Game Developer', 16).setOrigin(0.5).setTintFill(0xffffff);
        let artistText = this.add.bitmapText(centerX, centerY + 60, 'BC', '[Yash Malegaonkar] - Lead Artist', 16).setOrigin(0.5).setTintFill(0xffffff);
        let musicText = this.add.bitmapText(centerX, centerY + 100, 'BC', '[Pixabay] - Music', 16).setOrigin(0.5).setTintFill(0xffffff);


        //set back text and if click on back text go back to title 
        let backText = this.add.bitmapText(centerX-220, centerY - 130, 'BC', 'Back', 16).setOrigin(0.5).setInteractive().setTintFill(0xffffff)

        backText.on('pointerdown', () => {
            backText.setTint(0x00ff00);  
            this.buildm.pause();
            this.scene.start('titleScene');
        });

       

        
        
    }
}