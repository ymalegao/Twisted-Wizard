class Victory extends Phaser.Scene {
    constructor() {
        super('victoryScene');
        this.audioplaying = false;
    }

    preload() {
        this.load.path = './assets/';
        this.load.bitmapFont('BC', 'BC.png', 'BC.xml');
        this.load.audio('building', ['Build3.mp3']);
        this.load.spritesheet('victoryfire', 'victory.png',{
            frameWidth:500,
            frameHeight:300
        })

    }

    create(){
        this.anims.create({
            key: 'start',
            frameRate: 3.5,
            repeat:0,
            frames: this.anims.generateFrameNumbers('victoryfire', {
                start: 0,
                end:9
            })
        })
        this.victoryfire = this.physics.add.sprite(config.width/2, config.height/2, 'victoryfire', 0);

        this.victoryfire.play('start');
        let title01 = this.add.bitmapText(centerX, centerY-40, 'BC', 'Victory!', 32).setOrigin(0.5).setTintFill(0xffffff);
        let goPlay= this.add.bitmapText(centerX-100, centerY, 'BC', 'Play Again', 16).setOrigin(0.5).setTintFill(0xffffff).setInteractive();
        let goBack = this.add.bitmapText(centerX+100, centerY, 'BC', 'Title Screen', 16).setOrigin(0.5).setTintFill(0xffffff).setInteractive();

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