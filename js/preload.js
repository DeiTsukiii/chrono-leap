export function preload() {
    // player sprites sheets
    ['Right', 'Left'].forEach((sens) => {
        [
            { key: `playerIdle${sens}`, path: `assets/player/idle${sens}.png`, width: 32, height: 80 },
            { key: `playerWalk${sens}`, path: `assets/player/walk${sens}.png`, width: 44, height: 80 },
            { key: `playerRun${sens}`, path: `assets/player/run${sens}.png`, width: 58, height: 80 },
            { key: `playerSlide${sens}`, path: `assets/player/slide${sens}.png`, width: 88, height: 48 },
            { key: `playerJump${sens}`, path: `assets/player/jump${sens}.png`, width: 48, height: 80 },
            { key: `playerDoubleJump${sens}`, path: `assets/player/doubleJump${sens}.png`, width: 68, height: 80 }
        ].forEach(asset => {
            this.load.spritesheet(asset.key, asset.path, { frameWidth: asset.width, frameHeight: asset.height });
        });
    });

    // font
    this.load.font('Daydream', 'assets/font/Daydream.ttf');

    // map
    this.load.tilemapTiledJSON('lvl1', 'assets/map/lvl1.json');
    this.load.tilemapTiledJSON('tutorial', 'assets/map/tutorial.json');

    this.load.image('Tileset', 'assets/map/tileset/Power-Station/Tileset.png');
    this.load.image('TX Tileset Ground', 'assets/map/tileset/nature/TX Tileset Ground.png');
    this.load.image('TX Village Props', 'assets/map/tileset/nature/TX Village Props.png');
}
