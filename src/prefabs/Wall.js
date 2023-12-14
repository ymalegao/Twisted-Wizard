class Wall extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        //set parent scene to play.js and add/enable physics
        this.parentScene = scene;
        this.parentScene.add.existing(this);
        this.parentScene.physics.add.existing(this);
        this.parentScene.physics.world.enable(this);
        this.setPushable(false);
        this.setImmovable(true);   
                 

    }

    //function to preview the block, which is just the block at 0.5 alpha
    static preview(scene, x, y, texture) {
        const wallPreviews = [];
        const wallPreview = new Wall(scene, x, y, texture);
        wallPreview.setAlpha(0.5).setScale(0.5)
        wallPreviews.push(wallPreview);
        return wallPreviews;
    }
    
    //functtion for having three blocks in a row
    static previewThreeInRow(scene, x, y, texture) {
        const wallPreviews = [];

        for (let i = 0; i < 3; i++) {
            //adjust the x position of each brick depending on the iteration level
            const wallPreview = new Wall(scene, x + i * 32, y, texture);
            wallPreview.setAlpha(0.5).setScale(0.5);
            wallPreviews.push(wallPreview);
        }

        return wallPreviews;
    }

    //same function as above just adjust y value instead because its for column
    static previewThreeInCol(scene, x, y, texture) {
        const wallPreviews = [];
    
        for (let i = 0; i < 3; i++) {
            const wallPreview = new Wall(scene, x, y + i * 32, texture);
            wallPreview.setAlpha(0.5).setScale(0.5);
            wallPreviews.push(wallPreview);
        }
    
        return wallPreviews;
    }

    //main spawn function to place block 
    static spawn(scene, x, y, textureKey, width, height, wallprev, count) {
        //check if the wall count is valid (>0)
        if (count > 0) {
            //create new wall
            const newWall = new Wall(scene, x, y, textureKey, width, height);
            newWall.setScale(0.5);

            let canPlaceWall = true;
            //check if there are any walls that the x and y value interesects with and return nothing
            scene.wallGroup.getChildren().forEach(existingWall => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(newWall.getBounds(), existingWall.getBounds()) || count <= 0) {
                    canPlaceWall = false;
                    return;
                }
            });
            //if there is no wall at that place, return the wall object 
            if (canPlaceWall) {
                
                console.log('Wall placed at', x, y);
                return newWall;
            }
            //if not placed then destroy the wall and return null
            newWall.destroy();
            return null; 
        }
    }

}







