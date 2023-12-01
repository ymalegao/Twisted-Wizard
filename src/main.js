let config = {
    parent: 'phaser-game',
    type: Phaser.WEBGL,
    pixelArt: true,
    width: 500,
    height: 300,
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    },
    zoom:2,
    scene: [ Play ]
}

const game = new Phaser.Game(config)
