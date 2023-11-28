class Wall extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        // this.setDisplaySize(texture.width, texture.height);
        this.parentScene = scene;
        this.parentScene.add.existing(this);
        this.parentScene.physics.add.existing(this);
        this.parentScene.physics.world.enable(this);
        this.setPushable(false);
        this.setImmovable(true);                    

    }

    static preview(scene, x, y, texture) {
        const wallPreview = new Wall(scene, x, y, texture);
        wallPreview.setAlpha(0.5); // Adjust the alpha for transparency
        return wallPreview;
    }

    static spawn(scene, x, y, textureKey, width, height, wallprev) {
        // Check if there's already a wall at the specified position
        const newWall = new Wall(scene, x, y, textureKey, width, height);

        // Check if there's already a wall at the specified position within the wallGroup
        let canPlaceWall = true;

        // Check for overlap with each existing wall in the wallGroup
        scene.wallGroup.getChildren().forEach(existingWall => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(newWall.getBounds(), existingWall.getBounds())) {
                canPlaceWall = false;
                return;
            }
        });
        if (canPlaceWall) {
            // Create an actual wall object at the specified position
            // const wall = new Wall(scene, x, y, textureKey, width, height);
            // Additional logic for handling walls, collisions, etc.
            // ...
            console.log('Wall placed at', x, y);
            return newWall;
        }
        wallprev.setTintFill(0xff0000);
        console.log('Wall not placed at', x, y);
        
        newWall.destroy();
        return null; // Indicate that the wall was not spawned
    }
}






















