import { preload } from '../preload.js';
import { create } from '../create.js';
import { update } from '../update.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        preload.call(this);
    }

    create() {
        create.call(this);
    }

    update() {
        update.call(this);
    }
}