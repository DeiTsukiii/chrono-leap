import { checkCollides, loadMap, move, checkMap } from './game.js';

export function update() {
    move();
    checkCollides.call(this);

    checkMap.call(this);
    if (typeof window.gameVars.map === 'string') {
        const to = window.gameVars.map;
        const map = this.make.tilemap({ key: to, tileWidth: 32, tileHeight: 32 });
        window.gameVars.map = loadMap.call(this, map);
    }

    if (window.gameVars.cursors.pauseKey.isDown) {
        this.scene.pause();
        this.scene.launch('PauseScene');
    }

    this.events.on('resume', () => {
        const data = JSON.parse(localStorage.getItem('data'));
        
        window.gameVars.cursors = this.input.keyboard.addKeys({
            leftKey: Phaser.Input.Keyboard.KeyCodes[data.settings.keys.leftKey],
            rightKey: Phaser.Input.Keyboard.KeyCodes[data.settings.keys.rightKey],
            jumpKey: Phaser.Input.Keyboard.KeyCodes[data.settings.keys.jumpKey],
            slideKey: Phaser.Input.Keyboard.KeyCodes[data.settings.keys.slideKey],
            runKey: Phaser.Input.Keyboard.KeyCodes[data.settings.keys.runKey],
            pauseKey: Phaser.Input.Keyboard.KeyCodes.ESC
        });
    });
}