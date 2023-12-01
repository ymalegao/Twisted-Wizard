
// import {Wall} from '../prefabs/Wall';
class Play extends Phaser.Scene {
    constructor() {
        super('PlayScene')
        this.currentState = 'building';
        this.lightningEventTriggered = false;
        this.flag = false;
        this.buildingPhase = true;
        this.buldingTimer = null;
        this.spawnTimer = null;
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
        this.load.image('block1', 'block1.png' )



        // this.load.atlas('background', 'img/fruitandveg.png', 'img/fruitandveg.json')
        // this.load.bitmapFont('gem_font', 'font/gem.png', 'font/gem.xml')
    }

    create(){
    
        this.buldingTimer = this.time.addEvent({
            delay: 500, 
            callback: this.placingPhase,
            callbackScope: this,
            loop: true, 
            paused:false
        
        });

        
        this.spawnTimer = this.time.addEvent({
            delay: 4000, 
            callback: this.spawnRandomGoblin,
            callbackScope: this,
            loop: true,
            paused:true
        
        });
        const map = this.add.tilemap('backtilemapJSON');
        const tileset = map.addTilesetImage('tilemap', 'backTileImage');
        const bgLayer = map.createLayer('Tile Layer 1', tileset, 0,0);
        this.wizard = this.physics.add.sprite(config.width/2, config.height/2, 'wizard', 0);
        this.wizard.body.setCollideWorldBounds(true)
        this.wizard.body.setSize(this.wizard.width,this.wizard.height, true)

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
            frameRate: 16,
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
                end:5
            })
        })

        this.anims.create({
            key:'attack',
            frameRate:16,
            repeat:-1,
            frames:this.anims.generateFrameNumbers('goblin',{
                start:6,
                end:9
            })
        })

        this.anims.create({
            key:'die',
            frameRate:16,
            repeat:0,
            frames:this.anims.generateFrameNumbers('goblin',{
                start:10,
                end:20
            })
        })

        this.wizard.play('idle')
        this.cursors = this.input.keyboard.createCursorKeys()
        this.goblinGroup = this.physics.add.group();
        
        this.buildingPhase = true;
        this.lightningGroup = this.physics.add.group();
        if (this.lightningEventTriggered) {
        this.input.on('pointerdown', (pointer) => {
            this.castLightning(pointer.x, pointer.y);
        });
    }

       
        this.wallGroup = this.physics.add.group();
        this.wallarr = ['block1', 'block2', 'block3'];
        this.wallCount = 10;
        console.log(this.buildingPhase);
        
        
        // if (this.flag){
        //     console.log("did we do this tho")
        //     this.buldingTimer.paused = true;
        // }
        // if (this.flag){
        //     if (this.spawnTimer) {
        //         this.spawnTimer.paused = false;
        //     }else{
        //     console.log("enemy phase now");

        //         this.spawnTimer = this.time.addEvent({
        //         delay: 4000, 
        //         callback: this.spawnRandomGoblin,
        //         callbackScope: this,
        //         loop: true,
        //         paused:true
            
        //     });
        // }
        
        // }
    
        
    
}
    
   
    spawnRandomGoblin() {
        const randomX = Phaser.Math.Between(-200, config.width+100);
        const randomY = Phaser.Math.Between(-100, 300);
        this.spawnGoblins(randomX, randomY);
    }

    handleWallGoblinCollision(wall,goblin){
        console.log("collided with wall");
        goblin.play('attack');
    }
    spawnGoblins(x,y){
        const goblin = this.physics.add.sprite(x,y,'goblin');
        goblin.body.setImmovable(true);

        goblin.play('walk');
        this.goblinGroup.add(goblin);
        const angle = Phaser.Math.Angle.BetweenPoints(goblin, this.wizard);
        const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize().scale(20);
        goblin.body.setVelocity(velocity.x, velocity.y);
    }


    placingPhase(){
        console.log("calling function");
        console.log(this.buildingPhase);
        console.log(this.flag);
        console.log(this.wallCount);

        if (this.wallCount >= 0){
            
            if (this.wallCount === 0){
                console.log("do we get here")
                this.flag= true;
                this.buildingPhase = false;
                this.buldingTimer.paused = true;
                return null;
            }
            const ranIndex = Phaser.Math.Between(0, this.wallarr.length - 1);
            let wallPreview = Wall.preview(this, -1, -1, this.wallarr[0]);
            this.input.on('pointermove', (pointer) => {
                wallPreview.x = pointer.x;
                wallPreview.y = pointer.y;
                // wallPreview.clearTint();

            });
                
            this.input.on('pointerdown', (pointer) => {
                const spawnWall = Wall.spawn(this,pointer.x,pointer.y,this.wallarr[0],this.wallarr[0].height,this.wallarr[0].width,wallPreview, this.wallCount);
                wallPreview.destroy();
                    // if (this.wallCount <= 0){
                    //     wallPreview.destroy();
                    //     this.flag= true;
                    //     this.buildingPhase = false;
                    // }
                if (spawnWall){
                    this.wallGroup.add(spawnWall);
                    this.physics.add.collider(spawnWall, this.goblinGroup, this.handleWallGoblinCollision, null, this);
                    this.wallCount--;
                    console.log(this.wallCount);
                    wallPreview.destroy();
                    
                    if (this.wallCount === 0) {
                        this.flag = true;
                        this.buildingPhase = false;
                        this.buldingTimer.paused = true;
                    }
                }
            });
                
    }else{
        this.buildingTimer.paused = true;
    }
    }
        castLightning(x, y) {
            if (this.flag){
            const dist = y;

            const lightning = this.physics.add.sprite(x, 0, 'lightning').setOrigin(0,0).setDisplaySize(32,dist);
            this.physics.add.overlap(lightning, this.goblinGroup.getChildren(), this.handleLightningCollision, null, this);
            this.wizard.play("cast").once('animationcomplete', () => {
                this.wizard.play("idle");
             });

            lightning.play('strike').once('animationcomplete', () => {
                lightning.destroy();
                console.log('Strike!');
            
            
            });
            this.lightningGroup.add(lightning);
        }
        }
    
        
        handleLightningCollision(lightning, goblin) {
            lightning.play('strike', true, 0);
            
            goblin.play('die',true,0).once('animationcomplete', () => {
                goblin.destroy();
                console.log('defeated!');
            
            
            });
            console.log('Strike!');
        }
        

    update(){
        
        if (this.cursors.left.isDown) {
            this.wizard.play("cast").once('animationcomplete', () => {
                this.wizard.play("idle");
            });
        }

        if (!this.buildingPhase) {
            this.buldingTimer.paused = true;
            this.spawnTimer.paused = false;
            this.lightningEventTriggered = true;
            console.log(this.lightningEventTriggered)
            // if (!this.lightningEventTriggered) {
            //     this.input.on('pointerdown', (pointer) => {
            //         this.castLightning(pointer.x, pointer.y);
            //         this.lightningEventTriggered = true;
            //     });
            // }
        }

        // Other update logic
    }
}

        // this.physics.world.step(16.666666666666668);
       
     












