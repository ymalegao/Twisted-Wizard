// import {Wall} from '../prefabs/Wall';
class Play extends Phaser.Scene {
    constructor() {
        super('PlayScene')
    }

    preload() {
        // load assets
        this.load.path = './assets/'
        this.load.image('backTileImage',"tilemap.png")
        this.load.tilemapTiledJSON('backtilemapJSON', 'backgroundtiles.json')
        this.load.spritesheet('wizard', "wizard.png" ,{
            frameWidth:64,
            frameHeight:128
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



        // this.load.atlas('background', 'img/fruitandveg.png', 'img/fruitandveg.json')
        // this.load.bitmapFont('gem_font', 'font/gem.png', 'font/gem.xml')
    }

    create(){
        
        const map = this.add.tilemap('backtilemapJSON');
        const tileset = map.addTilesetImage('tilemap', 'backTileImage');
        const bgLayer = map.createLayer('Tile Layer 1', tileset, 0,0);
        this.wizard = this.physics.add.sprite(config.width/2, config.height/2, 'wizard', 0);
        this.wizard.body.setCollideWorldBounds(true)

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
        
        
        this.lightningGroup = this.physics.add.group();
        this.input.on('pointerdown', (pointer) => {
            this.castLightning(pointer.x, pointer.y);
        });

        this.spawnTimer = this.time.addEvent({
            delay: 4000, 
            callback: this.spawnRandomGoblin,
            callbackScope: this,
            loop: true, 
        });

        this.wallGroup = this.physics.add.group();
        const wallr = 'block1';
        const wall2 = 'block2';
        this.wallPreview = Wall.preview(this,-1,-1,wallr)
        this.input.on('pointermove', (pointer) => {
            this.wallPreview.x = pointer.x;
            this.wallPreview.y = pointer.y;
            this.wallPreview.setTint(0xff0000)

            
        })

        this.input.on('pointerdown', (pointer) => {
            
            const spawnWall = Wall.spawn(this,pointer.x,pointer.y,'block1',wallr.height,wallr.width,this.wallPreview);
            if (spawnWall){
                this.wallGroup.add(spawnWall);
                this.physics.add.collider(spawnWall, this.goblinGroup, this.handleWallGoblinCollision, null, this);
               
            
            
            }
            if (this.wallPreview) {
                this.wallPreview.setAlpha(1);
                this.wallPreview.setTint(0xff0000)
                console.log("here")
                this.wallPreview.destroy();
            }
            
            
            this.wallPreview = Wall.preview(this,-1,-1,wallr)
            
            console.log(this.wallGroup.getChildren())
            
        })


       
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
        
        castLightning(x, y) {
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
    
        
        handleLightningCollision(lightning, goblin) {
            // This function will be called when lightning collides with the ground
            lightning.play('strike', true, 0);
            
            goblin.play('die',true,0).once('animationcomplete', () => {
                goblin.destroy();
                console.log('defeated!');
            
            
            });
            console.log('Strike!');
        }
        
    update(){

        if(this.cursors.left.isDown) {
            this.wizard.play("cast").once('animationcomplete', () => {
                this.wizard.play("idle");
             });



        }

        

        this.goblinGroup.getChildren().forEach((goblin) => {

        })




    }


















}