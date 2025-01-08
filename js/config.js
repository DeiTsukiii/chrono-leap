import GameScene from "./scenes/game.js";
import PauseScene from "./scenes/pause.js";
import StartScene from "./scenes/start.js";

export const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#3498db',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: [StartScene, GameScene, PauseScene],
    parent: 'game-container'
};