import { loadMap } from './game.js';

export function create() {
    let player, cursors, data;
    window.gameVars = {};

    window.gameVars.collidesGroup = this.physics.add.staticGroup();
    window.gameVars.utilitiesGroup = this.physics.add.staticGroup();

    function loadPlayer() {
        // player initialisation
        player = this.physics.add.sprite(0, 0, 'playerIdleRight')
            .setBounce(0)
            .setOrigin(0, 1)
            .setScale(0.7)
            .setCollideWorldBounds(true)
            .setDepth(10);

        // player animations
        ['Right', 'Left'].forEach(sens => {
            const isLeft = sens === 'Left';

            [
                { key: 'Idle', sheet: `playerIdle${sens}`, frames: [0, 6], frameRate: 8, repeat: -1 },
                { key: 'Walk', sheet: `playerWalk${sens}`, frames: [0, 7], frameRate: 10, repeat: -1 },
                { key: 'Run', sheet: `playerRun${sens}`, frames: [0, 7], frameRate: 14, repeat: -1 },
                { key: 'Slide', sheet: `playerSlide${sens}`, frames: [0, 3], frameRate: 10, repeat: -1 },
                { key: 'JumpUp', sheet: `playerJump${sens}`, frames: isLeft ? [13, 6] : [0, 7], frameRate: 14, repeat: 0 },
                { key: 'JumpDown', sheet: `playerJump${sens}`, frames: isLeft ? [5, 3] : [8, 10], frameRate: 14, repeat: 0 },
                { key: 'Land', sheet: `playerJump${sens}`, frames: isLeft ? [2, 0] : [11, 13], frameRate: 13, repeat: 0 },
                { key: 'DoubleJump', sheet: `playerDoubleJump${sens}`, frames: [0, 13], frameRate: 30, repeat: 0 }
            ].forEach(({ key, sheet, frames, frameRate, repeat }) => {
                this.anims.create({
                    key: `player${key}${sens}`,
                    frames: this.anims.generateFrameNumbers(sheet, {
                        start: isLeft ? frames[1] : frames[0],
                        end: isLeft ? frames[0] : frames[1]
                    }),
                    frameRate,
                    repeat
                });
            });
        });

        // hitboxs
        player.on('animationstart', () => player.setSize(player.width, player.height).setOffset(0, 0));

        // collides
        this.physics.add.collider(player, window.gameVars.collidesGroup);
        this.physics.add.overlap(player, window.gameVars.collidesGroup, () => window.gameVars.isCollide = true);

        // controls
        cursors = this.input.keyboard.addKeys({
            leftKey: Phaser.Input.Keyboard.KeyCodes[data.settings.keys.leftKey],
            rightKey: Phaser.Input.Keyboard.KeyCodes[data.settings.keys.rightKey],
            jumpKey: Phaser.Input.Keyboard.KeyCodes[data.settings.keys.jumpKey],
            slideKey: Phaser.Input.Keyboard.KeyCodes[data.settings.keys.slideKey],
            runKey: Phaser.Input.Keyboard.KeyCodes[data.settings.keys.runKey],
            pauseKey: Phaser.Input.Keyboard.KeyCodes.ESC
        });
    }

    if (window.localStorage.getItem('data') === null) {
        window.localStorage.setItem('data', '{"lvl": "tutorial", "settings": {"keys": {"leftKey": "Q", "rightKey": "D", "jumpKey": "Z", "slideKey": "S", "runKey": "SPACE"}}}');
    }

    // {
    //     "lvl": "tutorial", 
    //     "settings": {
    //         "keys": [
    //             "leftKey": "Q",
    //             "rightKey": "D",
    //             "jumpKey": "Z",
    //             "slideKey": "S",
    //             "runKey": "SPACE"
    //         ]
    //     }
    // }

    data = JSON.parse(window.localStorage.getItem('data'));

    loadPlayer.call(this);
    window.gameVars.player = player;
    window.gameVars.map = loadMap.call(this, this.make.tilemap({ key: data.lvl, tileWidth: 32, tileHeight: 32 }));

    this.cameras.main.setZoom(2);
    this.cameras.main.startFollow(player);
    this.cameras.main.setLerp(0.1, 0.1);

    window.gameVars = {
        ...window.gameVars,
        player,
        lastPos: {x: player.x, y: player.y, size: player.width},
        cursors,
        isCollide: false,
        isJumping: false,
        isFalling: false,
        isSliding: false,
        isWalking: false,
        canDoubleJump: false,
        hasDoubleJump: false,
        remainingJumps: 2,
        lastOrientation: 'Right',
        lastSlide: 0,
        startingSlide: 0
    };
}