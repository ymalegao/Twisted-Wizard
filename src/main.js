let config = {
    
    parent: 'phaser-game',
    type: Phaser.WEBGL,
    pixelArt: true,
    width: 500,
    height: 300,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    zoom:2,
    pixelArt:true,
    scene: [  Title, Instructions, Play, GameOver, Victory, Credits ]
}

const game = new Phaser.Game(config)
let centerX = game.config.width/2;
let centerY = game.config.height/2;
