class Instructions extends Phaser.Scene {
    constructor() {
        super('instructionScene');
    }

    preload() {
        //load assets
        this.load.path = './assets/';
        this.load.bitmapFont('BC', 'BC.png', 'BC.xml');

        this.load.image('instructions', 'Instructions.png')
        this.load.audio('building', ['Build3.mp3']);

    }

    create() {
        //add image and music
        this.add.image(centerX, centerY, 'instructions');
        this.buildm = this.sound.add('building', {
            mute: false,
            volume: 0.5,
            rate: 1,
            loop: true
        });

    
    this.buildm.play();
   
    //option to go back to homescreen
    let backText = this.add.bitmapText(centerX-220, centerY - 130, 'BC', 'Back', 16).setOrigin(0.5).setInteractive().setTintFill(0xffffff)


    //instructions 
    let title04 = this.add.bitmapText(centerX, centerY-40, 'BC', 'During the Building Phase, place blocks around the wizard so he\n\n is protected by the walls. After you have placed all the blocks down,\n\nclick on the enemies to stop them from reaching the wizard. One\n\n collision with an enemy goblin will make you lose the game! ', 18)
        .setOrigin(0.5)
        .setTintFill(0xffffff)

    
    //go back if clicked on the back text
    backText.on('pointerdown', () => {
        backText.setTint(0x00ff00);
        this.buildm.pause();

        this.scene.start('titleScene');
    });
}
}
