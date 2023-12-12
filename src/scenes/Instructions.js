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
    this.add.image(centerX, centerY, 'instructions');
    this.cameras.main.setBackgroundColor('#eec39a');
    let backText = this.add.bitmapText(centerX-220, centerY - 130, 'BC', 'back', 16).setOrigin(0.5).setInteractive().setTintFill(0xffffff)


    let title04 = this.add.bitmapText(centerX, centerY-40, 'BC', 'During the Building Phase, place blocks around the wizard so he\n\n is protected by the walls. After you have placed all the blocks down,\n\nclick on the enemies to stop them from reaching the wizard. One\n\n collision with an enemy goblin will make you lose the game! ', 18)
        .setOrigin(0.5)
        .setTintFill(0xffffff)

    
    backText.on('pointerdown', () => {
        backText.setTint(0x00ff00);
        this.scene.start('titleScene');
    });
}
}
