class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
        this.audioplaying = false;
    }

    preload() {
        //load assets
        this.load.path = './assets/';
        this.load.bitmapFont('BC', 'BC.png', 'BC.xml');
        this.load.audio('building', ['Build3.mp3']);
        this.load.image('background', 'titlebackground.png');

    }

    create() {
        //set cursor to thunder cursor
        this.input.setDefaultCursor('url(./assets/leftwand.cur), pointer');
        //add background and sound
        this.add.image(centerX,centerY,'background');
        this.buildm = this.sound.add('building', {
            mute:false,
            volume:0.5,
            rate:1,
            loop:true
        });
        
        this.buildm.play();
          
        
        

      
       
        // this.cameras.main.setBackgroundColor('#ffffff');
        //add title
        let title01 = this.add.bitmapText(centerX+30, centerY-80, 'BC', 'Twisted Wizard', 45).setOrigin(0.5).setTintFill(0xffffff);
      

        //have instructions credits and click to play 
        let playText = this.add.bitmapText(centerX+40, centerY, 'BC', 'Click to play', 24).setOrigin(0.5).setInteractive().setTintFill(0xffffff);
        let instructionText = this.add.bitmapText(centerX-85, centerY, 'BC', 'Instructions | ', 24).setOrigin(0.5).setInteractive().setTintFill(0xffffff);
        let creditsText = this.add.bitmapText(centerX+150, centerY, 'BC', '| Credits', 24).setOrigin(0.5).setInteractive().setTintFill(0xffffff);


        //if they click on play text then start scene 
        playText.on('pointerdown', () => {
            playText.setTint(0x00ff00);  
            // this.scene.restart('PlayScene')
            
                this.buildm.stop()
        

            this.scene.start('PlayScene');
        });

        //if instructions is clicked on then go to that scene 
        instructionText.on('pointerdown', () => {
            instructionText.setTint(0x00ff00);  
            this.buildm.stop()

            this.scene.start('instructionScene');

        });

        //same for credits
        creditsText.on('pointerdown', () => {
            creditsText.setTint(0x00ff00);  
            this.buildm.stop()

            this.scene.start('creditsScene');
        });


    }
}
