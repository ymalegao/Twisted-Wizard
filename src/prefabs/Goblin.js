class Goblin extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'goblin');
        
        this.parentScene = scene;
        this.parentScene.add.existing(this);
        this.parentScene.physics.add.existing(this);
        this.parentScene.physics.world.enable(this);
        // this.body.setCollideWorldBounds(true);
        this.setVelocityX(20);

    }
   
    handleWallGoblinCollision(wall,goblin){
        console.log("collided with wall");
        goblin.play('attack');
    }

    // setGoblinVelocity(target) {
    //     console.log("setting velocity")
    //     const angle = Phaser.Math.Angle.BetweenPoints(this, target);
    //     console.log(angle)
    //     const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize().scale(20);
    //     goblin.body.setVelocity(velocity.x, velocity.y);
    // }

    static spawnGoblins(scene, x, y, target){
        const goblin = new Goblin(scene, x, y);
        goblin.setScale(0.5);

        if (target) {
            goblin.play('walk');
            const angle = Phaser.Math.Angle.BetweenPoints(goblin, target);
            console.log(angle)
            const velocity = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize().scale(100);
            console.log(velocity.x , velocity.y)

            goblin.body.setVelocity(20, velocity.y);
            // goblin.setGoblinVelocity(target);
        } else {
            console.warn("Goblin target is undefined. Check if 'this.wizard' is properly set.");
        }
        goblin.body.setVelocity(20);
        return goblin;
    }
}
