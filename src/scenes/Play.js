//things to do:
// have delay during phase switches and text that pops up saying "Enemy phase/ Rebuild yourwall"
//need to count phases to know if we want to multiply enemy count or wall count by phase number
//
//cursor less wide - lighting rectangle

//restart play scene after 

//after playtesting
// move goblins after two secondsish
// let player kill the enemys in goblin group before the building stage is starting 
//sound affect for killing hobonins
//levels faster
//slow and couple blocks around you 
//add sound afffect after the win and the loss
//turn down music, turn satutatiorn of the colors up
//add code documentation
//add credits to game
//move spawn blocks more off screen


class Play extends Phaser.Scene {
    constructor() {
        super('PlayScene')
        this.currentState = 'building';
        this.lightningEventTriggered = false;
        this.flag = false;
        this.buildingPhase = true;
        this.buldingTimer = null;
        this.spawnTimer = null;
        this.allowLightning = true;
        this.enemycount = 10;
        this.phaseNumber = 1;
        this.waveshown = false;
        this.blocksLeft = 10;
        this.blocksLeftText = null;
        this.blocksToSpawn = 10;


    }

    preload() {
        // load assets
        this.load.path = './assets/'

        this.load.image('backTileImage',"tilemap.png")
        this.load.tilemapTiledJSON('backtilemapJSON', 'backgroundtiles.json')
        this.load.spritesheet('wizard', "wizard.png" ,{
            frameWidth:64,
            frameHeight:72
        });
        this.load.spritesheet('lightning', "lightingsheet.png" ,{
            frameWidth:32,
            frameHeight:300
        });
        this.load.spritesheet('goblin','goblin.png',{
            frameWidth:34,
            frameHeight:64
        })
        this.load.image('block4', 'block4.png' );
        this.load.image('block3', 'block3.png' );
        this.load.image('block2', 'block2.png' );
        this.load.image('block1', 'block1.png' );
        this.load.bitmapFont('BC', 'BC.png', 'BC.xml');
        this.load.audio("battle", ['Battle3.mp3'])
        this.load.audio('building', ['Build3.mp3']);
        this.load.image('wand', 'wand.png');
        this.load.audio('thunder', ['clicksound.mp3'])
        this.load.audio('winsound', ['winsound.mp3'])
        this.load.audio('placeblock', ['blockplace.mp3'])
        this.load.audio('gameover', ['gameover.mp3'])





        // this.load.atlas('background', 'img/fruitandveg.png', 'img/fruitandveg.json')
        // this.load.bitmapFont('gem_font', 'font/gem.png', 'font/gem.xml')
    }

    create(){
        this.input.setDefaultCursor('url(./assets/biggerhammer.cur), pointer');
        this.spawnTimer = this.time.addEvent({
            delay: 1000-this.phaseNumber*100, 
            callback: this.spawnRandomGoblin,
            callbackScope: this,
            loop: true,
            paused:true
        
        });

        this.buildm = this.sound.add('building', {
            mute:false,
            volume:0.3,
            rate:1,
            loop:true
        });

        this.thunder = this.sound.add('thunder', {
            mute:false,
            volume:0.2,
            rate:3,
            loop:false,
        });
        this.placeblock = this.sound.add('placeblock', {
            mute:false,
            volume:1.5,
            rate:1,
            loop:false,
        });

        this.win = this.sound.add('winsound', {
            mute:false,
            volume:0.4,
            rate:1,
            loop:false
        });

        this.death = this.sound.add('gameover', {
            mute:false,
            volume:1.5,
            rate:1,
            loop:false
        });


        this.battlem = this.sound.add('battle', {
            mute:false,
            volume:0.5,
            rate:1,
            loop:true
        });
        // this.buildm.play();






        const map = this.add.tilemap('backtilemapJSON');
        const tileset = map.addTilesetImage('tilemap', 'backTileImage');
        const bgLayer = map.createLayer('Tile Layer 1', tileset, 0,0);
        this.wizard = this.physics.add.sprite(config.width/2, config.height/2, 'wizard', 0);
        this.wizard.body.setCollideWorldBounds(true)
        this.wizard.setDepth(1);
        this.wizard.body.setSize(this.wizard.width-40,this.wizard.height-25, true)

        this.anims.create({
            key: 'idle',
            frameRate: 4,
            repeat:-1,
            frames: this.anims.generateFrameNumbers('wizard', {
                start: 0,
                end:1
            })
        })

        this.anims.create({
            key: 'cast',
            frameRate: 18,
            repeat:0,
            frames: this.anims.generateFrameNumbers('wizard', {
                start: 3,
                end:12
            })

        })
        
        this.anims.create({
            key: 'strike',
            frameRate: 18,
            repeat:0,
            frames: this.anims.generateFrameNumbers('lightning', {
                start: 0,
                end:7
            })

        })

        this.anims.create({
            key:'walk',
            frameRate:8,
            repeat:-1,
            frames:this.anims.generateFrameNumbers('goblin',{
                start:0,
                end:4
            })
        })
        this.anims.create({
            key:'dizzy',
            frameRate:8,
            repeat:1,
            frames:this.anims.generateFrameNumbers('goblin',{
                start:5,
                end:8
            })
        })

        this.anims.create({
            key:'attack',
            frameRate:16,
            repeat:-1,
            frames:this.anims.generateFrameNumbers('goblin',{
                start:9,
                end:12
            })
        })

        this.anims.create({
            key:'die',
            frameRate:16,
            repeat:0,
            frames:this.anims.generateFrameNumbers('goblin',{
                start:13,
                end:23
            })
        })
        this.showBuildText();
        this.wizard.play('idle')
        this.cursors = this.input.keyboard.createCursorKeys()
        this.goblinGroup = this.physics.add.group();
        
        this.buildingPhase = true;
        this.lightningGroup = this.physics.add.group();
        
        
        this.wallGroup = this.physics.add.group();
        this.wallarr = ['block1', 'block2', 'block3'];
        this.wallCount = 14- 2* this.phaseNumber;
        
        this.blocksLeftText = this.add.bitmapText(centerX+90, centerY - 120, 'BC', 'Blocks Left: ' + this.wallCount, 16).setTintFill(0xfbf236)
       
            this.input.on('pointerdown', (pointer) => {
                if (!this.buildingPhase) {
                    this.castLightning(pointer.x, pointer.y);
                }
            });
        
        console.log(this.buildingPhase);
        this.input.once('pointermove', (pointer) => {
            if (this.buildingPhase && this.wallCount > 0) {
                this.placingPhase(pointer.x, pointer.y);
            }
        });

        this.input.on('pointerdown', (pointer) => {
            if (this.buildingPhase && this.wallCount > 0) {
                this.placingPhase(pointer.x, pointer.y);
            }
        });

}
showWaveText() {
    this.buildm.pause();
    this.input.setDefaultCursor('url(./assets/leftwand.cur), pointer');

    this.battlem.play();
    console.log("here")
    const waveText = this.add.bitmapText(centerX, centerY - 100, 'BC', 'Wave ' + this.phaseNumber, 32)
        .setOrigin(0.5)
        .setTint(0xfbf236)
        .setAlpha(0);  

   
    if (!this.waveshown){
        this.tweens.add({
        targets: waveText,
        duration: 1000,  
        scaleX: 1.5,  
        scaleY: 1.5, 
        alpha: 1, 
        ease: 'Quad.easeOut',  
        onComplete: () => {
            this.time.delayedCall(2000, () => {
               
                this.tweens.add({
                    targets: waveText,
                    duration: 500, 
                    alpha: 0,  
                    ease: 'Quad.easeIn',  
                    onComplete: () => {
                        waveText.destroy();
                        this.phaseNumber++;
                       
                    }
                });
            });
        }
        
    });

    }
}

showBuildText() {
    // const buildText = this.add.bitmapText(centerX, centerY - 90, 'BC', 'Build your Walls ', 32)
    this.battlem.pause();
    this.input.setDefaultCursor('url(./assets/lighter.cur), pointer');

    this.buildm.play();
    if (this.phaseNumber === 1){
        this.buildText = this.add.bitmapText(centerX, centerY - 100, 'BC', 'Build your Walls ', 32)
        .setOrigin(0.5)
        .setTintFill('0xfbf236')
        .setAlpha(0); 
    }else{
        this.buildText = this.add.bitmapText(centerX, centerY - 100, 'BC', 'Rebuild your Walls ', 32)
        .setOrigin(0.5)
        .setTintFill('0xfbf236')
        .setAlpha(0); 
    }
    
     
    this.waveshown = false;
    if (!this.waveshown){

        this.tweens.add({
        targets: this.buildText,
        duration: 1000, 
        scaleX: 1.5,  
        scaleY: 1.5, 
        alpha: 1, 
        ease: 'Quad.easeOut', 
        onComplete: () => {
            this.time.delayedCall(1500, () => {
                this.tweens.add({
                    targets: this.buildText,
                    duration: 500,  
                    alpha: 0, 
                    ease: 'Quad.easeIn', 
                    onComplete: () => {
                        this.buildText.destroy();
                        this.input.once('pointermove', (pointer) => {
                            if (this.buildingPhase && this.wallCount > 0) {
                                this.placingPhase(pointer.x, pointer.y);
                            }
                        });
                        
                       
                    }
                });
            });
        }
        
    });
    }
}
   //spawning goblin stuff here
    spawnRandomGoblin() {
        if (this.enemycount > 0){
        const spawnMargin = 50; 

    const randomSide = Phaser.Math.Between(0, 3);
    let randomX, randomY;

    switch (randomSide) {
        case 0: //top
            randomX = Phaser.Math.Between(-spawnMargin, config.width + spawnMargin);
            randomY = -spawnMargin;
            break;
        case 1: // bot
            randomX = Phaser.Math.Between(-spawnMargin, config.width + spawnMargin);
            randomY = config.height + spawnMargin;
            break;
        case 2: // left
            randomX = -spawnMargin;
            randomY = Phaser.Math.Between(-spawnMargin, config.height + spawnMargin);
            break;
        case 3: // right
            randomX = config.width + spawnMargin;
            randomY = Phaser.Math.Between(-spawnMargin, config.height + spawnMargin);
            break;
        default:
            break;
        }
    

            this.spawnGoblins(randomX, randomY);
        }

    }

    handleWallGoblinCollision(wall,goblin){
        console.log("collided with wall");
        wall.destroy();
        goblin.play('attack');
        goblin.play('dizzy').once("animationcomplete", ()=>{
            this.time.delayedCall(2000, () =>{
                console.log("Inside delayed call");
                if (goblin.active){
                    console.log("Inside attack call");
                    goblin.play('attack');
                const angle = Phaser.Math.Angle.BetweenPoints(goblin, this.wizard);
                const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize(100*(this.phaseNumber/2)).scale(35);
                goblin.body.setVelocity(velocity.x, velocity.y);
                }
            })
        
        })

        
    }
    spawnGoblins(x,y){
        const goblin = this.physics.add.sprite(x,y,'goblin');
        goblin.body.setImmovable(true);
        goblin.setScale(0.7);
        goblin.play('walk');
        this.goblinGroup.add(goblin);
        const angle = Phaser.Math.Angle.BetweenPoints(goblin, this.wizard);
        const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize(100).scale(35*(this.phaseNumber/2));
        goblin.body.setVelocity(velocity.x, velocity.y);
        
       
    }


    placingPhase(pointerX, pointerY) {
        console.log("calling function");
        console.log(this.buildingPhase);
        console.log(this.flag);
        console.log(this.wallCount);
    
        if (this.wallCount >= 0) {
    
            if (this.wallCount === 0) {
                console.log("do we get here")
                this.flag = true;
                this.buildingPhase = false;
                this.enemycount = 10;
                // this.buldingTimer.paused = true;
                
                return null;
            }
            let shouldPlaceThreeBlocks = Math.random() < 0.5;
            if (this.wallCount-3 === 2 || this.wallCount-3 === 1 || this.wallCount-3 === 0 || this.wallCount === 2 || this.wallCount === 1){
                console.log("force the else")
                shouldPlaceThreeBlocks = false;
            }
            let wallPreview;
        
                if (shouldPlaceThreeBlocks) {
                this.verticalPreview = Math.random() < 0.4;

                    if (this.verticalPreview ) {
                            console.log("vert")
                            wallPreview = Wall.previewThreeInCol(this, -1, -1, this.wallarr[0]);
                        } else {
                            console.log("hor")

                        wallPreview = Wall.previewThreeInRow(this, -1, -1, this.wallarr[0]);
                        }
                } else {
                    wallPreview = Wall.preview(this, -1, -1, this.wallarr[0]);
                }
            

    this.input.on('pointermove', (pointer) => {
        wallPreview.forEach((wall, index) => {
            if (this.wallCount > 0){
            if (this.verticalPreview) {
                wall.x = pointer.x;

                wall.y = pointer.y + index * 18;
            } else {
                wall.x = pointer.x + index * 18;

                wall.y = pointer.y;
            }
        }
        });
    });
        
                // wallPreview.clearTint();
                let blocksToSpawn = shouldPlaceThreeBlocks ? 3 : 1;
                console.log(blocksToSpawn , this.blocksLeft)
                if (blocksToSpawn > this.blocksLeft){
                    console.log("changed to 1 ", blocksToSpawn )
                    blocksToSpawn = 1;
                }
        
                this.input.once('pointerdown', (pointer) => {
                    if (this.wallCount >= blocksToSpawn) {
                        wallPreview.forEach((wall, index) => {
                            const spawnWall = Wall.spawn(
                                this,
                                wall.x,
                                wall.y,
                                this.wallarr[0],
                                this.wallarr[0].height,
                                this.wallarr[0].width,
                                wallPreview, 
                                this.wallCount
                            );
        
                            if (spawnWall) {
                                this.wallGroup.add(spawnWall);
                                this.placeblock.play()
                                this.physics.add.collider(spawnWall, this.goblinGroup, this.handleWallGoblinCollision, null, this);
                                this.wallCount -= 1;
                                this.blocksLeft-=1;
                            }
                        });
        
                        // this.wallCount -= blocksToSpawn;
                        // this.blocksLeft-=blocksToSpawn;
                        // console.log("subtracting from this.wallCount: ", this.wallCount);
        
                      
        
                        if (this.wallCount <= 0) {
                            
                            // this.flag = true;
                            this.buildingPhase = false;
                            this.showWaveText();
                            // this.buldingTimer.paused = true;
                            this.enemycount = 10 +this.phaseNumber*5;
                            this.blocksLeft =  10;

                        }

                    }
        
                    wallPreview.forEach(wall => wall.destroy());
                });
            }
    }
            
        castLightning(x, y) {
            this.thunder.play();

            console.log("casting lighting")
            const dist = y;

            const lightning = this.physics.add.sprite(x-13, 0, 'lightning').setOrigin(0,0).setDisplaySize(32,dist);
            lightning.setSize(16, 16).setOffset(0, lightning.height - 10);
            this.physics.add.overlap(lightning, this.goblinGroup.getChildren(), this.handleLightningCollision, null, this);
            this.wizard.play("cast").once('animationcomplete', () => {
                this.wizard.play("idle");
             });
            this.thunder.play();
            lightning.play('strike').once('animationcomplete', () => {
                
                lightning.destroy();
                console.log('Strike!');
            
            
            });
            this.lightningGroup.add(lightning);
        
        }
    
        
        handleLightningCollision(lightning, goblin) {
            if (!goblin.isHit) {

                goblin.isHit = true;  
                this.enemycount--;
        
                console.log(this.enemycount);
                goblin.body.enable = false;
        
                goblin.play('die').once('animationcomplete', () => {
                    goblin.destroy();
                    console.log('defeated!');
        
                    // Check if all goblins are defeated
                    if (this.enemycount <= 0 && this.goblinGroup.getChildren().length === 0){
                       
                        
                            this.buildingPhase = true;
                            this.wallCount = 10;
                            // this.blocksLeft = 10;
                            this.showBuildText();
                    
                    }
                });
            }
        }

        handleWizardCollision(goblin, wizard){
            this.battlem.pause();
            this.death.play();
            this.scene.start('gameoverScene')
            this.blocksLeft = 10;
            this.phaseNumber = 1;


        }


    update(){
        this.physics.overlap(this.lightningGroup, this.goblinGroup, this.handleLightningCollision, null, this);
        this.physics.overlap(this.wizard, this.goblinGroup, this.handleWizardCollision, null, this);

        if (this.cursors.left.isDown) {
            this.wizard.play("cast").once('animationcomplete', () => {
                this.wizard.play("idle");
            });
        }
        if (this.buildingPhase) {
            this.spawnTimer.paused = true;
            this.goblinGroup.getChildren().forEach(goblin=>{
                goblin.destroy();
            })
            this.updateBlocksLeftText();
        
        }

        
        if (!this.buildingPhase) {
            // this.buldingTimer.paused = true;
            this.spawnTimer.paused = false;
            this.hideBlocksLeftText();
       
            
        }

        if (this.phaseNumber === 4 && this.buildingPhase ){
            this.buildm.stop();
            this.win.play()
            this.spawnTimer.destroy();
            this.scene.start('victoryScene')
            this.phaseNumber = 1;

        }

    }

    updateBlocksLeftText() {
        this.blocksLeftText.setText('Blocks Left: ' + this.wallCount);
        this.blocksLeftText.setVisible(true);  
    }

    hideBlocksLeftText() {
        this.blocksLeftText.setVisible(false); 
    }
}













