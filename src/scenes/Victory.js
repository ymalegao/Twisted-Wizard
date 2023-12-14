class Victory extends Phaser.Scene {
    constructor() {
        super('victoryScene');
        this.audioplaying = false;
    }

    preload() {
        //load assets 
        this.load.path = './assets/';
        this.load.bitmapFont('BC', 'BC.png', 'BC.xml');
        this.load.audio('building', ['Build3.mp3']);
        this.load.spritesheet('victoryfire', 'victory.png',{
            frameWidth:500,
            frameHeight:300
        })

    }

    create(){
        //add sound
        this.buildm = this.sound.add('building', {
            mute:false,
            volume:0.5,
            rate:1,
            loop:true
        });
        //set victory animation 
        this.anims.create({
            key: 'start',
            frameRate: 3.5,
            repeat:0,
            frames: this.anims.generateFrameNumbers('victoryfire', {
                start: 0,
                end:9
            })
        })
        //add "sprite" to scene, but the sprite is basically an animated background
        this.victoryfire = this.physics.add.sprite(config.width/2, config.height/2, 'victoryfire', 0);
        //play animation 
        this.victoryfire.play('start');
        //play again text or title text
        let title01 = this.add.bitmapText(centerX, centerY-40, 'BC', 'Victory!', 32).setOrigin(0.5).setTintFill(0xffffff);
        let goPlay= this.add.bitmapText(centerX-100, centerY, 'BC', 'Play Again', 16).setOrigin(0.5).setTintFill(0xffffff).setInteractive();
        let goBack = this.add.bitmapText(centerX+100, centerY, 'BC', 'Title Screen', 16).setOrigin(0.5).setTintFill(0xffffff).setInteractive();


        //if click on play on, then play again 
        goPlay.on('pointerdown', () => {
            goBack.setTint(0x00ff00);  
            this.buildm.stop();
            this.scene.start('PlayScene');
        });

        //if click on the title scene then go back to title
        goBack.on('pointerdown', () => {
            goBack.setTint(0x00ff00);  
            this.scene.start('titleScene');
        });








    }









}