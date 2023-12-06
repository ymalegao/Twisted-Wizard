class Instructions extends Phaser.Scene {
    constructor() {
        super('instructionScene');
    }

    preload() {
        this.load.path = './assets/';
        this.load.bitmapFont('BC', 'BC.png', 'BC.xml');
        this.load.image('instructions', 'Instructions.png')
    }

    create() {
        this.add.image(centerX,centerY,'instructions')
        this.cameras.main.setBackgroundColor('#eec39a');
        let title01 = this.add.bitmapText(centerX, centerY-100, 'BC', 'Building Phase',18).setOrigin(0.5).setTintFill(0xffffff);

        let text1 = this.add.bitmapText(centerX, centerY-80, 'BC', 'Click to build walls to defend your Wizard from the evil goblins!',18).setOrigin(0.5).setTintFill(0xffffff);
        let title02 = this.add.bitmapText(centerX, centerY, 'BC', 'Enemy Phase',18).setOrigin(0.5).setTintFill(0xffffff);
        let text2 = this.add.bitmapText(centerX, centerY+20, 'BC', 'Click to strike the enemy with lightning!',18).setOrigin(0.5).setTintFill(0xffffff);





        // this.add.bitmapText(centerX, centerY - 10 , 'BC', '', 24).setOrigin(0.5);
        let backText = this.add.bitmapText(centerX, centerY + 70, 'BC', 'back', 24).setOrigin(0.5).setInteractive().setTintFill(0xffffff)

        backText.on('pointerdown', () => {
            backText.setTint(0x00ff00);  
            this.scene.start('titleScene');
        });

    }
}
