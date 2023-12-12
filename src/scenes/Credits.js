class Credits extends Phaser.Scene {
    constructor() {
        super('creditsScene');
        this.audioplaying = false;
    }

    preload() {
        this.load.path = './assets/';
        this.load.bitmapFont('BC', 'BC.png', 'BC.xml');
        this.load.audio('building', ['Build3.mp3']);
        this.load.image('backgrounds', 'credits.png');

    }

    create() {
        this.input.setDefaultCursor('url(./assets/leftwand.cur), pointer');
        this.add.image(centerX, centerY, 'backgrounds');

        this.buildm = this.sound.add('building', {
            mute: false,
            volume: 0.5,
            rate: 1,
            loop: true
        });

        if (!this.audioplaying) {
            this.buildm.play();
            this.audioplaying = true;
        }

        this.cameras.main.setBackgroundColor('#ffffff');

        let title01 = this.add.bitmapText(centerX, centerY - 60, 'BC', 'Twisted Wizard', 32).setOrigin(0.5).setTintFill(0xffffff);

        let developerText = this.add.bitmapText(centerX, centerY-20, 'BC', 'Developed by:', 28).setOrigin(0.5).setTintFill(0xffffff);
        let gameDevText = this.add.bitmapText(centerX, centerY + 20, 'BC', '[Yash Malegaonkar] - Game Developer', 16).setOrigin(0.5).setTintFill(0xffffff);
        let artistText = this.add.bitmapText(centerX, centerY + 60, 'BC', '[Yash Malegaonkar] - Lead Artist', 16).setOrigin(0.5).setTintFill(0xffffff);
        let musicText = this.add.bitmapText(centerX, centerY + 100, 'BC', '[Pixabay] - Music', 16).setOrigin(0.5).setTintFill(0xffffff);

        let backText = this.add.bitmapText(centerX-220, centerY - 130, 'BC', 'back', 16).setOrigin(0.5).setInteractive().setTintFill(0xffffff)

        backText.on('pointerdown', () => {
            backText.setTint(0x00ff00);  
            this.scene.start('titleScene');
        });

        developerText.setAlpha(0);
        gameDevText.setAlpha(0);
        artistText.setAlpha(0);
        musicText.setAlpha(0);

        this.tweens.add({
            targets: [developerText, gameDevText, artistText, musicText],
            alpha: 1,
            duration: 2000,
            ease: 'Power2'
        });

        developerText.setInteractive();
        developerText.on('pointerdown', () => {
            developerText.setTint(0x00ff00);
        });

        gameDevText.setInteractive();
        gameDevText.on('pointerdown', () => {
            gameDevText.setTint(0x00ff00);
        });

        artistText.setInteractive();
        artistText.on('pointerdown', () => {
            artistText.setTint(0x00ff00);
        });

        musicText.setInteractive();
        musicText.on('pointerdown', () => {
            musicText.setTint(0x00ff00);
        });

        
    }
}