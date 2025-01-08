import { config } from './config.js';

// disable right click contextmenu
document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

const game = new Phaser.Game(config);