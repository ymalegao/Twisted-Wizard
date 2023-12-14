
class Play extends Phaser.Scene {
    constructor() {
        super('PlayScene')
       
        this.buildingPhase = true; //always starting with building
        this.spawnTimer = null; //timer for goblins spawning 
        this.enemycount = 10;
        this.phaseNumber = 1;
        //these are all flags for conditions
        this.waveshown = false;
        this.blocksLeft = 10;
        this.blocksLeftText = null;
        this.blocksToSpawn = 10;


    }

    preload() {
        // load assets
        this.load.path = './assets/'
        //load background tiles
        this.load.image('backTileImage',"tilemap.png")
        this.load.tilemapTiledJSON('backtilemapJSON', 'backgroundtiles.json')
        //spritesheets
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
        //walls
        this.load.image('block4', 'block4.png' );
        this.load.image('block3', 'block3.png' );
        this.load.image('block2', 'block2.png' );
        this.load.image('block1', 'block1.png' );
        //font
        this.load.bitmapFont('BC', 'BC.png', 'BC.xml');
        //all audios
        this.load.audio("battle", ['Battle3.mp3'])
        this.load.audio('building', ['Build3.mp3']);
        this.load.image('wand', 'wand.png');
        this.load.audio('thunder', ['clicksound.mp3'])
        this.load.audio('winsound', ['winsound.mp3'])
        this.load.audio('placeblock', ['blockplace.mp3'])
        this.load.audio('gameover', ['gameover.mp3'])
        this.load.audio('zap', ['zap.mp3'])

    }

    create(){
        //set cursor to building cursor
        this.input.setDefaultCursor('url(./assets/biggerhammer.cur), pointer');
        //create spawn timer and pause
        this.spawnTimer = this.time.addEvent({
            delay: 1000-this.phaseNumber*100, 
            callback: this.spawnRandomGoblin,
            callbackScope: this,
            loop: true,
            paused:true
        
        });

        //adding sounds
        this.buildm = this.sound.add('building', {
            mute:false,
            volume:0.2,
            rate:1,
            loop:true
        });

        this.thunder = this.sound.add('zap', {
            mute:false,
            volume:0.3,
            rate:1,
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
            volume:1,
            rate:1,
            loop:false
        });

        this.death = this.sound.add('gameover', {
            mute:false,
            volume:3,
            rate:1,
            loop:false
        });


        this.battlem = this.sound.add('battle', {
            mute:false,
            volume:0.5,
            rate:1,
            loop:true
        });





        //create background tilemap
        const map = this.add.tilemap('backtilemapJSON');
        const tileset = map.addTilesetImage('tilemap', 'backTileImage');
        const bgLayer = map.createLayer('Tile Layer 1', tileset, 0,0);
        //create wizard, set collions and physics and set depth to one so blocks so behind
        this.wizard = this.physics.add.sprite(config.width/2, config.height/2, 'wizard', 0);
        this.wizard.body.setCollideWorldBounds(true)
        this.wizard.setDepth(1);
        //changing collison box
        this.wizard.body.setSize(this.wizard.width-40,this.wizard.height-25, true)


        //creating animations
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
        //call tween function 
        this.showBuildText();
        //start wizard animation
        this.wizard.play('idle')
        //set up user input
        this.cursors = this.input.keyboard.createCursorKeys()
        //create goblin group 
        this.goblinGroup = this.physics.add.group();
        //start buildingPhase at true just in case!!
        this.buildingPhase = true;
        //lightning group 
        this.lightningGroup = this.physics.add.group();
        
        //wall group
        this.wallGroup = this.physics.add.group();
        //
        this.wallarr = ['block1', 'block2', 'block3']; //wall array, really just need block[0] but I am wokring  on the other ones if I need to 
        //start with 12 then 10 then 8
        this.wallCount = 14- 2* this.phaseNumber;
        
        this.blocksLeftText = this.add.bitmapText(centerX+110, centerY - 140, 'BC', 'Blocks Left: ' + this.wallCount, 16).setTintFill(0xffffff)
            //if not building phase then cast lighting if click 
            this.input.on('pointerdown', (pointer) => {
                if (!this.buildingPhase) {
                    this.castLightning(pointer.x, pointer.y);
                }
            });
        
            //because first time so we want to get the preview before the first click is done
            this.input.once('pointermove', (pointer) => {
            if (this.buildingPhase && this.wallCount > 0) {
                this.placingPhase(pointer.x, pointer.y);
            }
        });

       //call placingPhase function every click in the  building phase
        this.input.on('pointerdown', (pointer) => {
            if (this.buildingPhase && this.wallCount > 0) {
                this.placingPhase(pointer.x, pointer.y);
            }
        });

}
//function to switch between phases kinda
showWaveText() {
    //pause music
    this.buildm.pause();
    //change cursor
    this.input.setDefaultCursor('url(./assets/leftwand.cur), pointer');
    //play battle music
    this.battlem.play();
    const waveText = this.add.bitmapText(centerX, centerY - 100, 'BC', 'Wave ' + this.phaseNumber, 32)
        .setOrigin(0.5)
        .setTintFill(0xffffff)
        .setAlpha(0);  

   
    if (!this.waveshown){
        //tween to pop from center 
        this.tweens.add({targets: waveText, 
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
                            //advance phase number after this call
                            waveText.destroy();
                            this.phaseNumber++;
                        
                        }
                    });
                });
        }
        
    });

    }
}

//function to also switch between phases
showBuildText() {
    //pause battle music
    this.battlem.pause();
    //change cursor
    this.input.setDefaultCursor('url(./assets/lighter.cur), pointer');
    //play build 
    this.buildm.play();
    //phase 1  is just build, phase2 is rebuild
    if (this.phaseNumber === 1){
        
        this.buildText = this.add.bitmapText(centerX, centerY - 100, 'BC', 'Build your Walls ', 32)
        .setOrigin(0.5)
        .setTintFill('0xffffff')
        .setAlpha(0); 
    }else{
        this.buildText = this.add.bitmapText(centerX, centerY - 100, 'BC', 'Rebuild your Walls ', 32)
        .setOrigin(0.5)
        .setTintFill('0xffffff')
        .setAlpha(0); 
    }
    
     
    this.waveshown = false;
    if (!this.waveshown){
        //same tween  as above just for buildtext as target
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
                        //get preview before they click again 
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
        //dont spawn if enemy count is alraedy down to 0
        if (this.enemycount > 0){
        
        const spawnMargin = 50; 

        const randomSide = Phaser.Math.Between(0, 3);
        let randomX, randomY;

    switch (randomSide) {
        case 0: //top so want number betwwen -50 and width + 50 and off screen
            randomX = Phaser.Math.Between(-spawnMargin, config.width + spawnMargin);
            randomY = -spawnMargin;
            break;
        case 1: // bot (-50 - width + 50) , (bottom +50)
            randomX = Phaser.Math.Between(-spawnMargin, config.width + spawnMargin);
            randomY = config.height + spawnMargin;
            break;
        case 2: // left so -50 , (-50 and height + 50 )
            randomX = -spawnMargin;
            randomY = Phaser.Math.Between(-spawnMargin, config.height + spawnMargin);
            break;
        case 3: // right so (width+50), (-50, height + 50)
            randomX = config.width + spawnMargin;
            randomY = Phaser.Math.Between(-spawnMargin, config.height + spawnMargin);
            break;
        default:
            break;
        }
    
            //call spawnGoblins function 
            this.spawnGoblins(randomX, randomY);
        }

    }
    //function to handle wall and goblin collisions
    handleWallGoblinCollision(wall, goblin) {
        //destroy wall play goblin animation
        wall.destroy();
        goblin.play('attack');
        
        //play dizzy and once its over if the goblin hasnt died then we play attack animation and reset velvocity and direction toward wizard
        goblin.play('dizzy').once("animationcomplete", () => {
            if (goblin.active) {
                goblin.play('attack');
                const angle = Phaser.Math.Angle.BetweenPoints(goblin, this.wizard);
                const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize(100 * (this.phaseNumber / 2)).scale(35);
                goblin.body.setVelocity(velocity.x, velocity.y);
            } else {
                goblin.destroy();
            }
        });
    }
    //function to add goblins to game
    spawnGoblins(x,y){
        //make new goblin and start animations and add to group
        const goblin = this.physics.add.sprite(x,y,'goblin');
        goblin.body.setImmovable(true);
        goblin.setScale(0.7);
        goblin.play('walk');
        this.goblinGroup.add(goblin);
        //set velcoity based on phase number and calculate angle between the goblin and the wizard in the middle
        const angle = Phaser.Math.Angle.BetweenPoints(goblin, this.wizard);
        const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize(100).scale(35*(this.phaseNumber/2));
        //set velocity
        goblin.body.setVelocity(velocity.x, velocity.y);
        
       
    }

    //placing phase function 
    placingPhase(pointerX, pointerY) {
        //if there are any walls to place
        if (this.wallCount >= 0) {
    
            // choose randomly if three block or 1 block 
            let shouldPlaceThreeBlocks = Math.random() < 0.5;
            //but if there are 2 or less blocks in the wall count then change the flag to a singl block
            if (this.wallCount-3 === 2 || this.wallCount-3 === 1 || this.wallCount-3 === 0 || this.wallCount === 2 || this.wallCount === 1){
                console.log("force the else")
                shouldPlaceThreeBlocks = false;
            }
            let wallPreview;
                //if placing three blocks then randomly see if verticle or horizontal
                if (shouldPlaceThreeBlocks) {
                this.verticalPreview = Math.random() < 0.4;
                    //call function accordingly one for verticle and one for horizontal
                    if (this.verticalPreview ) {
                            wallPreview = Wall.previewThreeInCol(this, -1, -1, this.wallarr[0]);
                        } else {

                        wallPreview = Wall.previewThreeInRow(this, -1, -1, this.wallarr[0]);
                        }
                } else {
                    wallPreview = Wall.preview(this, -1, -1, this.wallarr[0]);
                }
            
    //any time the pointer moves
    this.input.on('pointermove', (pointer) => {
        //change the position of the wallpreview to follow pointer
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
                //blocks to spawn is 3 or 1 depending on if placethreeblocks is true or not
                let blocksToSpawn = shouldPlaceThreeBlocks ? 3 : 1;
                //just doubleing checking here because sometimes it dint change 
                if (blocksToSpawn > this.blocksLeft){
                    console.log("changed to 1 ", blocksToSpawn )
                    blocksToSpawn = 1;
                }
        
                //for one click if wall count is greater than the number of blocks, 
                this.input.once('pointerdown', (pointer) => {
                    if (this.wallCount >= blocksToSpawn) {
                        //for each wallpreview, spawn a block from Wall prefab
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
        
                            //if valid wall was spawned aka not colliding with another wall 
                            if (spawnWall) {
                                //add wall to group
                                this.wallGroup.add(spawnWall);
                                //play sound
                                this.placeblock.play()
                                //add collider between wall and goblins group
                                this.physics.add.collider(spawnWall, this.goblinGroup, this.handleWallGoblinCollision, null, this);
                                //decreaase wallcount and blocksleft. wall count is for backend counting and blocksleft is for frontend number
                                this.wallCount -= 1;
                                this.blocksLeft-=1;
                            }
                        });
        
                        //if out of walls to place
                        if (this.wallCount <= 0) {
                            
                            //building phase is false
                            this.buildingPhase = false;
                            //call phase switch function 
                            this.showWaveText();
                            // this.buldingTimer.paused = true;
                            //set enemy count for stage
                            this.enemycount = 10 +this.phaseNumber*5;
                            //reset blocks left to 10 
                            this.blocksLeft =  10;

                        }

                    }
                    //destroy any leftover wall preview
                    wallPreview.forEach(wall => wall.destroy());
                });
            }
    }
            
        //function to click and cast lighting
        castLightning(x, y) {
            //play thunder sound
            this.thunder.play();
            //save distance of where y is clicked to change dimensions of lighting
            const dist = y;
            //add lgijting sprite to game, set size based on where the user clicked 
            const lightning = this.physics.add.sprite(x-13, 0, 'lightning').setOrigin(0,0).setDisplaySize(32,dist);
            //set hitbox for lightning 
            lightning.setSize(16, 16).setOffset(0, lightning.height - 10);
            //add overlap function to kill goblins if lighting overlaps
            this.physics.add.overlap(lightning, this.goblinGroup.getChildren(), this.handleLightningCollision, null, this);
            //play cast animation 
            this.wizard.play("cast").once('animationcomplete', () => {
                this.wizard.play("idle");
             });
            
            //  this.thunder.play();
            //after lughting anumation destory it 
             lightning.play('strike').once('animationcomplete', () => {
                
                lightning.destroy();
            
            
            });
            this.lightningGroup.add(lightning);
        
        }
    
      

        //function to destroy goblins when lighting struck
        handleLightningCollision(lightning, goblin) {
            //if goblin not been hit before
            if (!goblin.isHit) {

                goblin.isHit = true;  
                //decrease enemey count
                this.enemycount--;
        
                //stop goblin physics body so no more collisons 
                goblin.body.enable = false;
                //once die animation complete, destroy goblin 
                goblin.play('die').once('animationcomplete', () => {
                    goblin.destroy();
        
                    // Check if all goblins are defeated
                    
                    if (this.enemycount <= 0 && this.goblinGroup.getChildren().length === 0){
                       
                            //building phase is on now
                            this.buildingPhase = true;
                            //reset wall count but it will go down anyway
                            this.wallCount = 10;
                            //call phase switch function 
                            this.showBuildText();
                    
                    }
                });
            }else{
            }
        }

        //if goblin collides with wizard
        handleWizardCollision(goblin, wizard){
            //play death sound and pause music
            this.battlem.pause();
            this.death.play();
            //start the game over scene and reset variables if they restart 
            this.scene.start('gameoverScene')
            this.blocksLeft = 10;
            this.phaseNumber = 1;


        }


    update(){
        //check for overlaps between lightning and goblins and goblins and wzard
        this.physics.overlap(this.lightningGroup, this.goblinGroup, this.handleLightningCollision, null, this);
        this.physics.overlap(this.wizard, this.goblinGroup, this.handleWizardCollision, null, this);

        //if left is clicked play cast then idle 
        if (this.cursors.left.isDown) {
            this.wizard.play("cast").once('animationcomplete', () => {
                this.wizard.play("idle");
            });
        }
        //if building phase, no goblins allowed to be alive and timer is paused and block count is updating
        if (this.buildingPhase) {
            this.spawnTimer.paused = true;
            this.goblinGroup.getChildren().forEach(goblin=>{
                goblin.destroy();
            })
            this.updateBlocksLeftText();
        
        }

        //if its enemy phase then timer is unpaused and block text is hidden
        if (!this.buildingPhase) {
            // this.buldingTimer.paused = true;
            this.spawnTimer.paused = false;
            this.hideBlocksLeftText();
       
            
        }
        //if we are done with wave 3 and its the building phase again then 
        //stop sound play win sound, kill timer and start victory scene 
        if (this.phaseNumber === 4 && this.buildingPhase ){
            this.buildm.stop();
            this.win.play()
            this.spawnTimer.destroy();
            this.scene.start('victoryScene')
            this.phaseNumber = 1;

        }

    }

        //function to update the text on the screen during building phase
    updateBlocksLeftText() {
        this.blocksLeftText.setText('Blocks Left: ' + this.wallCount);
        this.blocksLeftText.setVisible(true);  
    }

   //hide the text when its not the bulding phase
    hideBlocksLeftText() {
        this.blocksLeftText.setVisible(false); 
    }
}













