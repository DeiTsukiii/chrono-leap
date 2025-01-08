export default class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
        this.pauseMenu = [];
        this.settingsMenu = [];
    }

    preload() {
        this.load.font('Daydream', '../assets/font/Daydream.ttf');
    }

    create() {
        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.5)');
        this.loadMainMenu();
        this.loadSettingsMenu();

        this.pauseMenu.forEach((element) => element.setVisible(false));
        this.settingsMenu.forEach((element) => element.setVisible(false));

        this.mainMenu();
    }

    loadMainMenu() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.pauseMenu.push(this.add.text(centerX, centerY - 150, 'Game Paused', {
            font: '32px Daydream',
            color: '#fff',
        }).setOrigin(0.5));

        const resumeButton = this.add.rectangle(centerX, centerY, 200, 50, 0x0077ff).setInteractive();
        this.pauseMenu.push(this.add.text(centerX, centerY, 'Resume', {
            font: '20px Daydream',
            color: '#fff',
        }).setOrigin(0.5));

        resumeButton.on('pointerover', () => resumeButton.setFillStyle(0x0055aa));
        resumeButton.on('pointerout', () => resumeButton.setFillStyle(0x0077ff));
        resumeButton.on('pointerdown', () => this.resumeGame());

        const settingsButton = this.add.rectangle(centerX, centerY + 150, 200, 50, 0x8A8A8A).setInteractive();
        this.pauseMenu.push(this.add.text(centerX, centerY + 150, 'Settings', {
            font: '20px Daydream',
            color: '#fff',
        }).setOrigin(0.5));

        settingsButton.on('pointerover', () => settingsButton.setFillStyle(0x4E4E4E));
        settingsButton.on('pointerout', () => settingsButton.setFillStyle(0x8A8A8A));
        settingsButton.on('pointerdown', () => this.settings());

        this.pauseMenu.push(resumeButton, settingsButton);
    }

    loadSettingsMenu() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.settingsMenu.push(this.add.text(centerX, 100, 'Settings', {
            font: '32px Daydream',
            color: '#fff',
        }).setOrigin(0.5));

        const closeButton = this.add.rectangle(40, 40, 50, 50, 0xFF0000).setInteractive();
        this.settingsMenu.push(this.add.text(40, 40, 'X', {
            font: '20px Daydream',
            color: '#fff',
        }).setOrigin(0.5));

        closeButton.on('pointerover', () => closeButton.setFillStyle(0xB30000));
        closeButton.on('pointerout', () => closeButton.setFillStyle(0xFF0000));
        closeButton.on('pointerdown', () => this.mainMenu());

        this.settingsMenu.push(closeButton);

        const data = JSON.parse(localStorage.getItem('data'));
        const keyBindings = data?.settings?.keys || {};
        const buttons = ['left', 'right', 'jump', 'slide', 'run'];

        buttons.forEach((key, index) => {
            key = `${key}Key`;
            const yOffset = centerY + index * 50 - 100;
            const currentKey = keyBindings[key] || 'Not Set';
        
            const keyText = this.add.text(centerX - 100, yOffset, `${key.replace('Key', '')} : `, {
                font: '20px Daydream',
                color: '#fff',
            }).setOrigin(0.5);
            this.settingsMenu.push(keyText);
        
            const changeButton = this.add.rectangle(centerX + 100, yOffset, 40, 40, 0x0077ff).setInteractive();
            const buttonText = this.add.text(centerX + 100, yOffset, currentKey, {
                font: '16px Daydream',
                color: '#fff',
            }).setOrigin(0.5);
            
            const updatedWidth = buttonText.width + 20;
            changeButton.setSize(updatedWidth, 40);
        
            changeButton.on('pointerover', () => changeButton.setFillStyle(0x0055aa));
            changeButton.on('pointerout', () => changeButton.setFillStyle(0x0077ff));
        
            changeButton.on('pointerdown', () => {
                buttonText.setText('_');
                const updatedWidth = buttonText.width + 20;
                changeButton.setSize(updatedWidth, 40);
                
                this.input.keyboard.once('keydown', (event) => {
                    const newKey = event.key.toUpperCase().replace(' ', 'SPACE');
                    data.settings.keys[key] = newKey;
                    localStorage.setItem('data', JSON.stringify(data));
                    
                    buttonText.setText(newKey);
                    const updatedWidth = buttonText.width + 20;
                    changeButton.setSize(updatedWidth, 40);
                });
            });
        
            this.settingsMenu.push(changeButton, buttonText);
        });
    }

    resumeGame() {
        this.scene.resume('GameScene');
        this.scene.stop('PauseScene');
    }

    settings() {
        this.pauseMenu.forEach((element) => element.setVisible(false));
        this.settingsMenu.forEach((element) => element.setVisible(true));
    }

    mainMenu() {
        this.settingsMenu.forEach((element) => element.setVisible(false));
        this.pauseMenu.forEach((element) => element.setVisible(true));
    }
}