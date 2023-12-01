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
        // this.wallarr = ['block1', 'block2', 'block3'];
                 

    }

    static preview(scene, x, y, texture) {
        const wallPreview = new Wall(scene, x, y, texture);
        wallPreview.setAlpha(0.5).setScale(0.5)
        // wallPreview.setOrigin(0.2,0.4) // Adjust the alpha for transparency
        return wallPreview;
    }

    static spawn(scene, x, y, textureKey, width, height, wallprev, count) {
        if (count > 0) {
            const newWall = new Wall(scene, x, y, textureKey, width, height);
            newWall.setScale(0.5);

            let canPlaceWall = true;

            scene.wallGroup.getChildren().forEach(existingWall => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(newWall.getBounds(), existingWall.getBounds()) || count <= 0) {
                    canPlaceWall = false;
                    return;
                }
            });
            if (canPlaceWall) {
                
                console.log('Wall placed at', x, y);
                return newWall;
            }
            wallprev.setTint(0xff0000);

            console.log('Wall not placed at', x, y);
            newWall.destroy();
            return null; 
        }
    }
}






















