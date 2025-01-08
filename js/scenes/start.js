export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        this.load.font('Daydream', '../assets/font/Daydream.ttf');
    }

    create() {
        this.cameras.main.setBackgroundColor('#0E0E0E');
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.add.text(centerX, centerY - 150, 'Chrono Leap', {
            font: '32px Daydream',
            color: '#fff',
        }).setOrigin(0.5);

        const button = this.add.rectangle(centerX, centerY, 200, 50, 0x0077ff).setInteractive();
        this.add.text(centerX, centerY, 'Start', {
            font: '20px Daydream',
            color: '#fff',
        }).setOrigin(0.5);

        button.on('pointerover', () => {
            button.setFillStyle(0x0055aa);
        });
        button.on('pointerout', () => {
            button.setFillStyle(0x0077ff);
        });

        button.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
